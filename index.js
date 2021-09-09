const fs = require('fs');
const chalk = require('chalk');

const client = require('contentful').createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_CONTENT_API_TOKEN,
});

var dataDir;

// Construct the data object for the menu
const fetchMenu = async () => {
  const entries = await client.getEntries({
    content_type: 'menuItem'
  });

  let menu = [];
  for (item in entries.items) {
    let thisItem = entries.items[item];
    menu.push({
      "title": thisItem.fields.title,
      "description": thisItem.fields.description,
      "price": thisItem.fields.price,
      "currency": thisItem.fields.currency,
      "category": thisItem.fields.category, 
      "dietary": {
        "vegan": thisItem.fields.vegan,
        "vegetarian": thisItem.fields.vegetarian,
        "glutenFree": thisItem.fields.glutenFree
      }
      //   "photo:": {
      //     "imageUrl": STRING,
      //     "attribution": {
      //       "text": STRING,
      //       "url": STRING
      //     }
      //   }
    });
  };
  return menu;
}

// Construct the data object for the site pages
const fetchPages = async () => {
  const entries = await client.getEntries({
    content_type: 'page'
  });

  let pages = {};
  for (item in entries.items) {
    let thisItem = entries.items[item];
    pages[thisItem.fields.title.toLowerCase()] = {
      "title": thisItem.fields.title,
      "description": thisItem.fields.description,
      "body": thisItem.fields.body
    };
  };
  return pages;
}


// save the data to the specified file
const saveData = async (data, file) => {
  const path = `${dataDir}/${file}`;
  await fs.writeFileSync(path, JSON.stringify(data));
  console.log('Fetched and stashed:', chalk.green(`=> ${path}`));
}


module.exports = {

  async onPreBuild({ inputs, utils }) {
    
    // ensure we have the specified directory for our data
    dataDir = inputs.dataDir;
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    try {
      const menu = await fetchMenu();
      await saveData(menu, 'menu.json');
      const pages = await fetchPages();
      await saveData(pages, 'pages.json');

    }
    catch(err) {
      utils.build.failBuild(`Error fetching data: ${err}`);
    }
  }

};