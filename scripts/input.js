function inputRating(){
    let input = document.getElementById("inputRating").value;
    if (input > 10){
        input = 10;
    } else if (input < 1) {
        input = 1;
    }
    console.log(input);
}