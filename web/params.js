scaleIsActive = true;
linksIsActive = false;
colorIsActive = false;

function checkActiveParams(){

  if (document.getElementById('scaleParam').className=='is-selected')
    scaleIsActive = true;
  else scaleIsActive = false;

  if (document.getElementById('linkParam').className=='is-selected')
    linksIsActive = true;
  else linksIsActive = false;

  if (document.getElementById('colorParam').className=='is-selected')
    colorIsActive = true;
  else colorIsActive = false;

  console.log("Activation des params :")
  console.log(scaleIsActive);
  console.log(linksIsActive);
  console.log(colorIsActive);

}
