 # demo-restaurant-data-contentful

 A Netlify build plugin to fetch content from a Contentful space and save it as JSON files in the ready for an SSG to use to generate an example restaurant site.

 Data will be delivered as per the schema defined here: https://github.com/netlify/dx-restuarant-sites-data


 ## Usage for Development and Deployment

This plugin is to be used as a local plugin and not added to the official Netlify Plugin register.

### Include in your project as git submodule

```bash
git submodule add git@github.com:netlify/demo-restaurant-data-contentful netlify/plugins/demo-restaurant-data-contentful
```


### Add the plugin to your project's `netlify.toml`

```toml

[[plugins]]
  package = "./netlify/plugins/demo-restaurant-data-contentful"

  [plugins.inputs]
    # Directory for the generated JSON data files to reside in
    dataDir = "data"

```


### add the Contentful creds to your project as environment variable

You can use the Netlify CLI for this

```

# Create or link your project with Netlify
netlify create
# or
netlify link

# Add the Contentful Space ID
netlify env:set CONTENTFUL_SPACE_ID XXX

# Add the Contentful Content Delivery API access token
netlify env:set CONTENTFUL_CONTENT_API_TOKEN XXX

# Run Netlify Build to prime your build cache with the data 
# This will use your centrally managed env vars
netlify build

# You now have data to build against
netlify dev
```

