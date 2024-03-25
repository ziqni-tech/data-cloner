const { getToken } = require('../axiosInstance');
const writeFile = require('../utils/writeFile');
const convertRules = require('../utils/convertRules');
const {
  downloadedFileName,
  transformedFileName,
  createdFileName,
  errorFileName
} = require('../utils/constants');

const { idsList, status } = require('./queryData');

const entityName = 'achievements';

const getDataByStatus = async () => {
  try {
    const allAchievements = [];
    let totalRecordsFound = 5;
    const limit = 100;
    let skip = 0;
    let recordsReceived = 0;

    const must = status === 'All'
      ? []
      : [
          {
            queryField: 'status',
            queryValues: [status]
          }
        ];

    do {
      const api = await getToken();

      const { data: resultsData } = await api.post('/achievements/query', {
        limit,
        skip,
        must
      });

      const achievements = resultsData.results;
      totalRecordsFound = resultsData.meta.totalRecords;

      for (let i = 0; i < achievements.length; i++) {
        const record = achievements[i];

        // Fetch rules only if record exists
        if (record) {
          const { data } = await api.post('/rules/query', {
            should: [{
              queryField: 'entityId',
              queryValues: [record.id]
            }],
            shouldMatch: 1
          });

          // Check if rules exist
          if (data.results && data.results[0]) {
            record.rules = data.results[0];
            record.rules.entityId = '';
            delete record.rules.id;
            delete record.rules.entityType;
          }
        }

        allAchievements.push(record);
      }

      skip += limit;
      recordsReceived += achievements.length;
    } while (recordsReceived < totalRecordsFound && recordsReceived - allAchievements.length < limit);

    console.group('Fetch Info');
    console.log('totalRecordsFound', totalRecordsFound);
    console.log('recordsReceived', recordsReceived);
    console.groupEnd();

    writeFile(entityName, downloadedFileName, allAchievements);
  } catch (e) {
    console.error('Fetch Achievements error => ', e);
  }
};

const getDataById = async () => {
  try {
    const allAchievements = [];
    let totalRecordsFound = 5;
    const limit = 100;
    let skip = 0;
    let recordsReceived = 0;

    do {
      const api = await getToken();

      const { data: resultsData } = await api.post('/achievements/query', {
        limit,
        skip,
        must: [
          {
            queryField: 'id',
            queryValues: [...idsList]
          }
        ]
      });

      const achievements = resultsData.results;
      totalRecordsFound = resultsData.meta.totalRecords;

      for (let i = 0; i < achievements.length; i++) {
        const record = achievements[i];

        // Fetch rules only if record exists
        if (record) {
          const { data } = await api.post('/rules/query', {
            should: [{
              queryField: 'entityId',
              queryValues: [record.id]
            }],
            shouldMatch: 1
          });

          // Check if rules exist
          if (data.results && data.results[0]) {
            record.rules = data.results[0];
            record.rules.entityId = '';
            delete record.rules.id;
            delete record.rules.entityType;
          }
        }

        allAchievements.push(record);
      }

      skip += limit;
      recordsReceived += achievements.length;
    } while (recordsReceived < totalRecordsFound && recordsReceived - allAchievements.length < limit);

    console.group('Fetch Info');
    console.log('totalRecordsFound', totalRecordsFound);
    console.log('recordsReceived', recordsReceived);
    console.groupEnd();

    writeFile(entityName, downloadedFileName, allAchievements);
  } catch (e) {
    console.error('Fetch Achievements error => ', e);
  }
};

const transform = async () => {
  const allAchievements = require(`../entitiesData/${ entityName }/downloaded.json`);

  const transformedItems = [];

  for (let i = 0; i < allAchievements.length; i++) {
    const record = allAchievements[i];
    const transformedMember = transformItem(record);
    transformedItems.push(transformedMember);
  }

  writeFile(entityName, transformedFileName, transformedItems);
};

function transformItem(inputObject) {
  const productIds = inputObject.products.map(product => product.id);

  const convertedRules = convertRules(inputObject.rules);

  return {
    customFields: inputObject.customFields,
    tags: inputObject.tags,
    metadata: inputObject.metadata,
    name: `${ inputObject.name }`,
    description: inputObject.description,
    termsAndConditions: inputObject.termsAndConditions,
    icon: inputObject.icon,
    banner: inputObject.banner,
    bannerLowResolution: inputObject.bannerLowResolution,
    bannerHighResolution: inputObject.bannerHighResolution,
    scheduling: inputObject.scheduling,
    maxNumberOfIssues: inputObject.maxNumberOfIssues,
    constraints: inputObject.constraints,
    achievementDependencies: inputObject.achievementDependencies,
    memberTagsFilter: inputObject.memberTagsFilter,
    productIds: productIds,
    productTagsFilter: inputObject.productTagsFilter,
    strategies: inputObject.strategies,
    rules: convertedRules
  };
}

const create = async () => {
  const allItems = require(`../entitiesData/${ entityName }/transformed.json`);

  const createdItems = [];
  const errors = [];

  for (let i = 0; i < allItems.length; i++) {
    try {
      const api = await getToken();

      const { data } = await api.post('/achievements', [allItems[i]]);

      if (data.errors.length) {
        const error = {
          id: allItems[i].id,
          name: allItems[i].name,
          errors: data.errors
        };
        errors.push(error);

      }

      if (data.results.length) {
        createdItems.push(data.results[0]);
      }
    } catch (e) {
      console.log('CREATE ERROR', e.response.data.errors);
    }
  }

  if (errors.length) {
    console.log('errors', errors.length);
    writeFile(entityName, errorFileName, errors);
  }

  if (createdItems.length) {
    console.log('copied achievements', createdItems.length);
    writeFile(entityName, createdFileName, createdItems);
  }
};

const args = process.argv.slice(2);

if (args.length > 0) {
  switch (args[0]) {
    case 'getDataByStatus':
      getDataByStatus();
      break;
    case 'getDataById':
      getDataById();
      break;
    case 'transform':
      transform();
      break;
    case 'create':
      create();
      break;
  }
} else {
  console.log('You must specify the function name (create / transform / fetch) in the command line argument! ' +
    'For example - node fileName.js create');
}