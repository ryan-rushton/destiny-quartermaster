## The Generated API

This is where the generated bungie api lives.

It is generated from the openapi.json specification at [bungie's github](https://github.com/Bungie-net/api) using the [openapi-generator](https://github.com/OpenAPITools/openapi-generator) in a docker box.

To generate it make sure you have docker installed and run `yarn generate-api` from the top level of the project directory, note that you need to have docker installed
