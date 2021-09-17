"use strict";

const getRandomJobName = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const findJobLineByName = (jobName, stdout) => {
  const re = new RegExp(
    "^(\\w+)\\s+(\\w+)\\s+(\\d+)\\s+" + jobName + "\\s+?(\\d+)\\s.+$",
    "gim"
  );
  return re.exec(stdout);
};

const findJobLineById = (jobId, stdout) => {
  const re = new RegExp(
    "^(\\w+)\\s+(\\w+)\\s+" + jobId + "\\s+(.+)\\s+?(\\d+)\\s.+$",
    "gim"
  );
  return re.exec(stdout);
};

module.exports = {
  getRandomJobName,
  findJobLineByName,
  findJobLineById,
};
