import { AppDataSource } from "./data-source.js";

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
  })
  .catch((error) => console.log(error));
