    //-----------------------------------
    // Use Data from Firestore
    //-----------------------------------
    /*
    Goes through each category of the users history on firebase and adds it to a chart.
    */

    function chartMyData() {
      var labels = []; //insert task names here
      var values = []; //insert timespent values here
      let i = 0;
      //read data from Firestore
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          db.collection("history").doc(user.uid).get()
            .then(function (doc) {
              while (i < 7) {
                let y; //y-axis
                let x; //x-axis
                if (i == 0) {
                  y = doc.data().drink;
                  x = "Drink";
                }
                if (i == 1) {
                  y = doc.data().entertainment;
                  x = "Entertainment";
                }
                if (i == 2) {
                  y = doc.data().food;
                  x = "Food";
                }
                if (i == 3) {
                  y = doc.data().school;
                  x = "School/Work";
                }
                if (i == 4) {
                  y = doc.data().shopping;
                  x = "Shopping";
                }
                if (i == 5) {
                  y = doc.data().transportation;
                  x = "Transportation";
                }
                if (i == 6) {
                  y = doc.data().misc;
                  x = "Misc";
                }

                values.push(y); //timespent display on y
                labels.push(x); //nickname display on x
                console.log(labels);
                console.log(values);
                i++;
              }
            })
            .then(function () {
              displayGraph(labels, values); //Display data from arrays
            })
        } else {
          // No user signed in.
        }
      })
    }
    chartMyData();



    //---------------------------------------------------------
    // Simply graph the data provided in the input param arrays
    //---------------------------------------------------------
    function displayGraph(xlabels, yvalues) {
      //define the graphing area
      var grapharea = document.getElementById('myChart');

      //assemble data for chart
      const data = {
        labels: xlabels,
        datasets: [{
          label: 'Total money spent',
          backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#50c458", "#c49250"],
          //borderColor: 'rgb(255, 99, 132)',
          data: yvalues
        }]
      };
      const config = {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Total Money Spent'
            }
          }
        },
      };

      //launch ie. "create" the chart
      const myChart = new Chart(myChartCanvas, config)
    }





    //------------------second graph----------------------------
    //-----------------------------------
    // Use Data from Firestore
    //-----------------------------------
    function chartMyData2() {
      var labels = []; //insert task names here
      var values = []; //insert timespent values here
      let i = 0;
      //read data from Firestore
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          db.collection("history").doc(user.uid).get()
            .then(function (doc) {
              while (i < 2) {
                let y = 0; //y-axis
                let x; //x-axis
                let total = parseInt(doc.data().drink) + parseInt(doc.data().entertainment) + parseInt(doc.data()
                    .food) +
                  parseInt(doc.data().school) + parseInt(doc.data().shopping) + parseInt(doc.data()
                    .transportation) +
                  parseInt(doc.data().misc);
                if (i == 0) {
                  y = total;
                  x = "Used";
                }
                if (i == 1) {
                  let output = parseInt(doc.data().budget);
                  y = output - total;
                  console.log(y);
                  x = "Remaining";
                }

                values.push(y); //timespent display on y
                labels.push(x); //nickname display on x
                console.log(labels);
                console.log(values);
                i++;
              }
            })
            .then(function () {
              displayGraph2(labels, values); //Display data from arrays
            })
        } else {
          // No user signed in.
        }
      })
    }
    chartMyData2();



    //---------------------------------------------------------
    // Simply graph the data provided in the input param arrays
    //---------------------------------------------------------
    function displayGraph2(xlabels, yvalues) {
      //define the graphing area
      var grapharea = document.getElementById('myChart');

      //assemble data for chart
      const data = {
        labels: xlabels,
        datasets: [{
          label: 'remaining budget',
          backgroundColor: ["#ffd966", "#50c458"],
          //borderColor: 'rgb(255, 99, 132)',
          data: yvalues
        }]
      };
      const config = {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Remaining Budget'
            }
          }
        },
      };

      //launch ie. "create" the chart
      const myChart = new Chart(myChartCanvas2, config)
    }