# Airtable listing theme for Gatsby

### [Airtable](https://airtable.com/)に統合されたGatsbyスターター [gatsby-airtable-listing](https://www.gatsbyjs.com/starters/wkocjan/gatsby-airtable-listing)を使用した私の好きな映画リスト
[Over 40 Web Club](https://over40webclub.netlify.app/)の2020-10-25の勉強会で途中までの作成を実演しました。

[![Netlify Status](https://api.netlify.com/api/v1/badges/8f5d678c-4883-4f56-9af6-9234c2474a4e/deploy-status)](https://app.netlify.com/sites/pitang-movie-list/deploys)

## Demo
https://pitang-movie-list.netlify.app/


## Screenshot

![The home page](screenshot.png?raw=true)

## Features

- Integration with [Airtable](https://airtable.com/)
- Item details displayed in a modal with navigation (previous / next)
- Responsive/adaptive images via [gatsby-image](https://www.gatsbyjs.org/packages/gatsby-image/)
- Uses utility-first [TailwindCSS](https://tailwindcss.com/) framework
- Responsive design (desktop / mobile)
- Generic newsletter form

## 🚀 Getting started

Install [Node package manager (NPM)](https://nodejs.org/) (if you haven't already).

### Get the source code and install dependencies.

```
$ git clone git@github.com:wkocjan/gatsby-airtable-listing.git
$ npm install
```

### Create Airtable base

To use this project you have to have a Airtable account.

Once you have it, go to [this base](https://airtable.com/shrlYuICEwEdAUir3) and click `Copy base` button located in the top right corner.

Included columns:

- `title` (single line text)
- `slug` (single line text, should be unique)
- `rating` (single line text)
- `image` (attachment)
- `descrition` (long text)
- `countries` (single select)
- `tags` (multiple select)
- `url` (single line text)
- `year` (single line text)

### Set up Airtable API keys

Copy included `.env.example` file to `.env` and fill it with your unique values:

```
AIRTABLE_API_KEY=""
AIRTABLE_BASE_ID=""
AIRTABLE_TABLE_NAME="Destinations"
```

You can find your API key and Base ID by clicking "Help" and then "API Documentation". Table name in the example is "Destinations" (case sensitive name).

You're now ready to go. If you want to customize the Airtable base, please refer to [`gatsby-source-airtable` plugin documentation](https://www.gatsbyjs.org/packages/gatsby-source-airtable/).

## Crucial Commands

This project comes with a few handy commands for linting and code fixing. The most important ones are the ones to develop and ship code. You can find the most important commands below.

#### `gatsby develop`

Run in the project locally.

#### `gatsby build`

Run a production build into `./public`. The result is ready to be put on any static hosting you prefer.
