"use strict";

const getRandomJobName = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const findJobLineByName = (jobName, output) => {
  const re = new RegExp(
    "^(\\w+)\\s+(\\w+)\\s+(\\d+)\\s+" + jobName + "\\s+?(\\d+)\\s.+$",
    "gim"
  );
  return re.exec(output);
};

const findJobLineById = (jobId, output) => {
  const re = new RegExp(
    "^(\\w+)\\s+(\\w+)\\s+" + jobId + "\\s+(.+)\\s+?(\\d+)\\s.+$",
    "gim"
  );
  return re.exec(output);
};

module.exports = {
  getRandomJobName,
  findJobLineByName,
  findJobLineById,
};
