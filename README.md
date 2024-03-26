# Data Cloner

## Description
This project is a data cloning tool that allows you to copy data from one platform space to another. It provides a command line interface (CLI) for retrieving data from one platform space, converting it into the required format for saving and creating data in another space.

## Installation
1. Clone this repository to your local machine.
   https://github.com/ziqni-tech/data-cloner
2. Install the required dependencies by running `npm install` in the project directory.

## Usage
### Cloning Steps
Step 1: Set up Credentials
1. In your repository, locate the file named `.env.example`.
2. Rename it to `.env` or create a new file with the same name.
3. Fill in the following credentials in the `.env` file:
   - GET_DATA_SPACE: Space name from which you want to copy the data.
   - POST_DATA_SPACE: Space name to which you want to save the data.
   - USER_NAME: Platform login credentials.
   - PASSWORD: Platform login credentials.

Step 2: Get data from space
1. You can clone data by ID or status
2. You have a folder with the name of the entity (achievements) in which the queryData.js file is located
3. Fill the idsList array with the IDs you want to copy or enter the status from the statuses array into the status constant. You can select the status `All` and then all records of this entity will be copied, or you can select a specific status for example `Active` and then entities only with this status will be copied
4. Run the command `node ./entityName/clone(Entity)s.js getDataById` or `getDataByStatus` to copy data from space. Example: `node ./achievements/cloneAchievements.js getDataById`
5. The fetched data will be saved in a JSON file, the path of which will be displayed in the console.
6. Review the contents of this JSON file to ensure the data has been copied correctly.

Step 3: Transform Data
1. If the received data is correct, you can convert it to the format required for saving
2. Run the command `node ./entityName/clone(Entity)s.js transform` to perform the transformation. Example: `node ./achievements/cloneAchievements.js transform`
3. The transformed data will be saved in a JSON file that you can review to ensure it is in the correct format.

Step 4: Create data in other space
1. After making sure that the converted data is correct, you can upload it to your other space.
2. Run the command `node ./entityName/clone(Entity)s.js create` to create the data in your desired space using the converted data.