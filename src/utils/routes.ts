import { readdir, access } from "fs/promises";
import { join } from "path";
import { resolve } from "path";
import { Hono } from "hono";
import logger from "./logger";

export default class loader {
  constructor(private app: Hono) {}

  private async loadfile(filePath: string): Promise<void> {
    try {
      const { default: init } = await import(filePath);
      if (typeof init === "function") init(this.app);
      else logger.error(`${filePath} does not export a valid route initializer`);
    } catch (error) {
      logger.error(`Error loading route ${filePath}: ${(error as Error).message}`);
    }
  }

  private async directory(directory: string): Promise<void> {
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      await Promise.all(
        entries.map((entry) => {
          const filePath = join(directory, entry.name);
          return entry.isDirectory()
            ? this.directory(filePath)
            : entry.name.match(/\.(ts)$/)
            ? this.loadfile(filePath)
            : Promise.resolve();
        })
      );
    } catch (error) {
      logger.error(`Failed to process directory ${directory}: ${(error as Error).message}`);
    }
  }

  public async loadfolder(directory: string): Promise<void> {
    const resolvedPath = resolve(directory);
  
    await this.directory(resolvedPath).catch((error) =>
      logger.error(`Failed to load routes from ${resolvedPath}: ${(error as Error).message}`)
    );
  }
}
