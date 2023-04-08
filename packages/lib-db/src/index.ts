import { AppDataSource } from "./data-source.js";

AppDataSource.initialize()
  .then(() => {
    // todo: impl
  })
  .catch((error) => console.log(error));
