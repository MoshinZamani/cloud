function getActive(data) {
  const ids = [];
  data.forEach((element) => {
    const currentTime = new Date().getTime();
    const timeStamp = new Date(element.timeStamp).getTime();
    const difference = currentTime - timeStamp;
    const differenceInMin = Math.round(difference / 60000);

    if (differenceInMin >= parseInt(element.expirationTime)) {
      ids.push(element._id);
    }
  });
  return ids;
}

module.exports = getActive;
