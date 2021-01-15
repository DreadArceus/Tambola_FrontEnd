const heading = document.getElementById("heading");
heading.textContent = "Wait up";
const cells = document.getElementsByClassName("cell");
const url = window.location.search;
const urlparams = new URLSearchParams(url);
const game_id = urlparams.get("game_id");
const key = urlparams.get("key");
getTicket = async () => {
  var ticketData = [];
  await fetch(`https://tambola-django.herokuapp.com/ticket/${game_id}/${key}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      ticketData = data.grid;
      heading.textContent = "Your Ticket";
    })
    .catch((err) => {
      console.log(err);
    });
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 3; j++) {
      cells[i + j * 9].textContent =
        ticketData[i][j] === "X" ? "." : ticketData[i][j];
    }
  }
};
getTicket();
for (var i = 0; i < 27; i++) {
  cells[i].addEventListener("click", (e) => {
    const cell = e.toElement;
    if (cell.textContent != ".") {
      if (cell.style.textDecoration === "line-through") {
        cell.style.textDecoration = "";
      } else {
        cell.style.textDecoration = "line-through";
      }
    }
  });
}
document.getElementById("claim-btn").addEventListener("click", () => {
  var ticket_state = "";
  for (var i = 0; i < 27; i++) {
    if (cells[i].style.textDecoration === "line-through") {
      ticket_state += "1";
    } else {
      ticket_state += "0";
    }
  }
  fetch(`https://tambola-django.herokuapp.com/claim/${game_id}/${ticket_state}/${key}`, {
    method: "PUT",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Claim Successful");
    })
    .catch((err) => {
      console.log(err);
    });
});
