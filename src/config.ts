import env from 'dotenv';

env.config();

export interface Config {
  sites: Site[];
  mailgun: Mailgun,
  receiver: string,
}

export interface Mailgun {
  key: string,
  domain: string
}

export interface Site {
  name: string;
  url: string;
}

export const config: Config = {
  sites: [
    {
      name: "svk-toy",
      url: "https://www.villakoirakerho.com/pentu_toy.html"
    },
    {
      name: "svk-miniature",
      url: "https://www.villakoirakerho.com/pentulistat_kaavil.html"
    },
    {
      name: "maltankos",
      url: "http://www.maltankos.com/Pentuja.html"
    },
    {
      name: "poodlerocks",
      url: "https://www.poodlerocks.com/puppies3"
    },
    {
      name: "lumijoen-kennel",
      url: "https://lumijoenkennel.webnode.fi/maltasepuppy/"
    }
  ],
  mailgun: {
    key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  },
  receiver: process.env.EMAIL
};

export default config;