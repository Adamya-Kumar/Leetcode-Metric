document.addEventListener("DOMContentLoaded", function () {
  const userInput = document.getElementById("user-input");
  const searchBtn = document.getElementById("search-btn");
  const statsContainer = document.getElementsByClassName("stats-container");
  const easyProgressCir = document.getElementsByClassName("easy-progress");

  const mediumProgressCir = document.getElementsByClassName("medium-progress");
  const hardProgressCir = document.getElementsByClassName("hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const statsCardContainer = document.getElementById("stats-card");

  function vaildationUserName(username) {
    if (username.trim() == "") {
      alert("Username is not empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invaild Username");
    }
    return isMatching;
  }

  function updateProgress(solved, total, label, circle) {
    const progressDrgree = (solved / total) * 100;
    console.log(progressDrgree);
    label.textContent = `${solved}/${total}`;
   
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchBtn.textContent = "Searching...";
      searchBtn.disabled = true;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }
      const data = await response.json();
      // console.log("fetch data",data);
      displayUserData(data);
    } catch (error) {
      statsContainer.innerHTML = `<p>data not found</p>`;
    } finally {
      searchBtn.textContent = "Search";
      searchBtn.disabled = false;
    }
  }

  function displayUserData(responseData) {
    const totalQues = responseData.totalQuestions;
    const totalEasyQues = responseData.totalEasy;
    const totalMediumQues = responseData.totalMedium;
    const totalHardQues = responseData.totalHard;

    const totalSolvedQues = responseData.totalSolved;
    const totalSolvedEasyQues = responseData.easySolved;
    const totalSolvedMediumQues = responseData.mediumSolved;
    const totalSolvedHardQues = responseData.hardSolved;

    updateProgress(
      totalSolvedEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCir
    );
    updateProgress(
      totalSolvedMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCir
    );
    updateProgress(
      totalSolvedHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCir
    );

    const cardData = [
      {
        label: "Overall Acceptance Rate",
        value: responseData.acceptanceRate,
      },
      {
        label: "Ranking",
        value: responseData.ranking,
      },
      {
        label: "Total Contribution Points",
        value: responseData.contributionPoints,
      },
    ];
    console.log(cardData)
    statsCardContainer.innerHTML = cardData.map(
        data =>{
            return `
                <div class="card">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                </div>
            `
        }
    ).join("")

}

  searchBtn.addEventListener("click", function () {
    const userName = userInput.value;
    if (vaildationUserName(userName)) {
      fetchUserDetails(userName);
    }
  });
});
