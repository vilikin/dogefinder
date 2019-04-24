import config, { Site } from './config';
import axios from 'axios';
import BPromise from 'bluebird';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { html } from "common-tags";
import cron from 'node-cron';

import mailgunJs from 'mailgun-js';

const mailgun = mailgunJs({ apiKey: config.mailgun.key, domain: config.mailgun.domain });
mkdirSync('cache'); // make sure that cache directory exists

async function run(): Promise<void> {
  await BPromise.each(config.sites, checkSiteForChanges);
}

async function checkSiteForChanges(site: Site) {
  const { data } = await axios.get(site.url);
  if (!data) return;

  const cachedSite = getSiteFromCache(site);

  if (cachedSite && hasSiteChanged(data, cachedSite)) {
    await notifyErikaAboutSiteChange(site);
  }

  updateCache(site, data);
}

function getSiteFromCache(site: Site): string | null {
  try {
    return readFileSync(getCacheFilePathOfSite(site))
      .toString();
  } catch (e) {
    return null;
  }
}

function hasSiteChanged(currentHtml: string, cachedHtml: string): boolean {
  return currentHtml !== cachedHtml;
}

function updateCache(site: Site, currentHtml: string) {
  writeFileSync(getCacheFilePathOfSite(site), currentHtml);
}

function getCacheFilePathOfSite(site: Site) {
  return `cache/${site.name}.html`;
}

async function notifyErikaAboutSiteChange(site: Site): Promise<void> {
  console.log("site changed!!!!", site);

  const data = {
    from: `Dogefinder <dogefinder@${config.mailgun.domain}>`,
    to: config.receiver,
    subject: "Puppy news! \\(^O^)/",
    html: html`
        <p>Check out <b>${site.name}</b> has new puppy news for you! Awesome:D</p>
        <p>Check the site:<br/>${site.url}</p> 
    `
  };

  try {
    const result = await mailgun.messages().send(data);
    console.log(`Mail sent successfully!`);
  } catch (e) {
    console.log(`Error occurred while sending mail: ${e}`);
  }
}

const hourly = '0 * * * *';
cron.schedule(hourly, () => {
  console.log(`Running DogeFinder at: ${new Date()}`);
  run();
});
