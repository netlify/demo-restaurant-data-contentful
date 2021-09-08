const fs = require('fs');
const chalk = require('chalk');

const client = require('contentful').createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_CONTENT_API_TOKEN,
});


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

// save the data to the specified file
const saveData = async (data, path) => {
  await fs.writeFileSync(path, JSON.stringify(data));
  console.log('Fetched and stashed:', chalk.green(`=> ${path}`));
}


module.exports = {

  async onPreBuild({ inputs }) {
    try {
      const menu = await fetchMenu();
      await saveData(menu, `${inputs.dataDir}/menu.json`);

    }
    catch(err) {
      utils.build.failBuild(`Error fetching data: ${err}`);
    }
  }

};