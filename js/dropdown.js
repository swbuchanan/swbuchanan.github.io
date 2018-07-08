var open1 = false
function openDrop1() {
  if (!open1) {
    document.getElementById("myDropdown1").style.height = "275px";
    open1= true;
  } else {
    document.getElementById("myDropdown1").style.height = "0px";
    open1 = false;
  }
  document.getElementById("pointer1").classList.toggle("open"); /* rotates the little arrow thingy */
  document.getElementById("dropContainer1").classList.toggle("open");
} 

var open2 = false
function openDrop2() {
  if (!open2) {
    document.getElementById("myDropdown2").style.height = "250px";
    open2 = true;
  } else {
    document.getElementById("myDropdown2").style.height = "0px";
    open2 = false;
  }
  document.getElementById("pointer2").classList.toggle("open");
  document.getElementById("dropContainer2").classList.toggle("open");
}

var open3 = false
function openDrop3() {
  if (!open3) {
    document.getElementById("myDropdown3").style.height = "250px";
    open3 = true;
  } else {
    document.getElementById("myDropdown3").style.height = "0px";
    open3 = false;  
  }
  document.getElementById("pointer3").classList.toggle("open");
  document.getElementById("dropContainer3").classList.toggle("open");
}

var openNavDrop = false
function openDropNav() {
  if (!openNavDrop) {
    document.getElementById("myDropdownNav").style.height = "80px";
    document.getElementById("dropContainerNav").style.marginBottom = "120px";
    openNavDrop = true;
  } else {
    document.getElementById("myDropdownNav").style.height = "0px";
    document.getElementById("dropContainerNav").style.marginBottom = "40px";
    openNavDrop = false;  
  }
  document.getElementById("pointerNav").classList.toggle("open");
  // document.getElementById("dropContainerNav").classList.toggle("open");
}