let Parser = require("rss-parser");
let parser = new Parser({
  customFields: {
    item: [["media:content", "media:content", { keepArray: true }]],
  },
});
const { toXML } = require("jstoxml");

async function retriveinfo() {
  let oldfeed = await parser.parseURL(
    "https://cms.thepostmillennial.com/77cf36745bb5ca54e6a362d4c18b69/rss/"
  );

  const xmlOptions = {
    // filter: {
    //   "<": "<",
    //   ">": ">",
    //   '"': '"',
    //   "'": "'",
    //   "&": "&",
    // },
    filter: false,
    attributesFilter: false,
    header: true,
    indent: "  ",
  };

  let feed = {
    _name: "rss",
    _attrs: {
      version: "2.0",
      "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
      "xmlns:wfw": "http://wellformedweb.org/CommentAPI/",
      "xmlns:dc": "http://purl.org/dc/elements/1.1/",
      "xmlns:atom": "http://www.w3.org/2005/Atom",
      "xmlns:sy": "http://purl.org/rss/1.0/modules/syndication/",
      "xmlns:slash": "http://purl.org/rss/1.0/modules/slash/",
      "xmlns:georss": "http://www.georss.org/georss",
      "xmlns:geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
      "xmlns:snf": "http://www.smartnews.be/snf",
      "xmlns:media": "http://search.yahoo.com/mrss/",
    },
    _content: {
      channel: [
        {
          title: `<![CDATA[${oldfeed.title}]]>`,
        },
        {
          description: `<![CDATA[${oldfeed.description}]]>`,
        },
        {
          link: "thepostmillennial.com",
        },
        {
          lastBuildDate: () => new Date(),
        },
        {
          pubDate: () => new Date(),
        },
        {
          language: "en",
        },
        {
          copyright: "@The Post Millennial Inc.",
        },
        { ttl: 15 },
        {
          "sy:updatePeriod": "hourly",
        },
        {
          "sy:updateFrequency": 1,
        },
        {
          "snf:logo": {
            url: "https://static.thepm.media/logo/tpm-black.png",
          },
        },
        {
          "snf:darkModeLogo": {
            url: "https://static.thepm.media/logo/tpm-white.png",
          },
        },
      ],
    },
  };

  oldfeed.items.forEach((item, index) => {
    feed._content.channel.push({
      item: {
        title: `<![CDATA[${item.title}]]>`,
        link: item.link
          ? item.link.replace(
              "cms.thepostmillennial.com",
              "thepostmillennial.com"
            )
          : null,
        description: `<![CDATA[${item.description}]]>`,
        guid: item.link
          ? item.link.replace(
              "cms.thepostmillennial.com",
              "thepostmillennial.com"
            )
          : null,
        pubDate: item.pubDate,
        "content:encoded": `<![CDATA[${item["content:encoded"]}]]>`,
        category: `<![CDATA[${item.categories}]]>`,
        "dc:creator": item.creator,
        "dc:language": "en",
        "media:thumbnail": item["media:content"][0].$.url
          ? item["media:content"][0].$.url.replace(
              "content/images",
              "content/images/size/w300"
            )
          : null,
        "media:status": "active",
        "snf:advertisement": {
          "snf:adcontent": `<![CDATA[<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
                            <script>
                                window.googletag = window.googletag || {cmd: []};
                                googletag.cmd.push(function() {
                                googletag.defineSlot('/21843107763/TPM_M_inline_nth', [[320, 50], [300, 250]], 'div-gpt-ad-1626811554003-0').addService(googletag.pubads());
                                googletag.pubads().enableSingleRequest();
                                googletag.enableServices();
                            });
                            </script>
                            <div id='div-gpt-ad-1626811554003-0' style='min-width: 300px; min-height: 50px;'>
                            <script>
                                googletag.cmd.push(function() { googletag.display('div-gpt-ad-1626811554003-0'); });
                            </script>
                            </div>  ]]>`,
        },
      },
    });
  });
  return toXML(feed, xmlOptions);
}

async function main() {
  // console.log(await retriveinfo());
  return retriveinfo();
}
// main();
exports.handler = async (event, context, callback) => {
  const rss = main();
  return rss;
};
