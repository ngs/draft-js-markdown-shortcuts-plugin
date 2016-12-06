module.exports = (props) => {
  const body = props && props.body ? props.body : '';
  const template = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
      <title>draft-js-markdown-shortcuts-plugin Demo</title>
      <link rel="stylesheet" href="./css/normalize.css"/>
      <link rel="stylesheet" href="./css/base.css"/>
      <link rel="stylesheet" href="./css/Draft.css"/>
      <link rel="stylesheet" href="./css/prism.css"/>
      <link rel="stylesheet" href="./css/CheckableListItem.css"/>
      <link rel="stylesheet" href="./app.css"/>
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:700,300,700i,300i" rel="stylesheet" type="text/css"/>
      <link href='https://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
      <link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
      <div id="root">${body}</div>
      <script src="./app.js"></script>
    </body>
  </html>`.trim();
  return template.trim();
};
