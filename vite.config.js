const cleanHTML = () => {
  return {
    name: "no-attribute",
    transformIndexHtml(html) {
      html = html.replace(`type="module"`, "")
      html = html.replaceAll(`crossorigin`, "")
      let scriptTag = html.match(/<script[^>]*>(.*?)<\/script[^>]*>/)[0]
      html = html.replace(scriptTag, '')
      html = html.replace("<!-- # INSERT SCRIPT HERE -->", scriptTag)
      return html
    }
  }
}

module.exports = {
    root: 'dev',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        polyfillModulePreload: false,
        assetsInlineLimit: '6000'
    },
    base: './',
    plugins: [cleanHTML()]
}

