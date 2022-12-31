document.getElementById('myInput').value = '';
function getIp() {
    return fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => data.ip);
}
function showIP(){
    getIp()
    .then(ip => {
        document.getElementById("myIP").innerHTML = "My Public IP Adress: " + ip;
    });
}
window.onload = showIP;
const getData = document.getElementById('submitbtn');

getData.addEventListener('click', getGeoLocation);

function getGeoLocation() {
    getIp()
    .then(ip => {
      return fetch(`https://ipinfo.io/${ip}?token=bf46684badf49b`);
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const location = data.loc.split(",");
      const latitude = location[0];
      const longitude = location[1];
      const city = data.city;
      const region1 = data.region;
      const org = data.org;
      const host = org.substring(org.indexOf(' '),org.length);
      const timeZone = data.timezone;
      const pincode = data.postal;
    //   console.log(host)

      document.getElementById('latitude').innerHTML = "Lat: " + latitude;
      document.getElementById('longitude').innerHTML = "Long: " + longitude;
      document.getElementById('city').innerHTML = "City: " + city;
      document.getElementById('region2').innerHTML = "Region: " + region1;
      document.getElementById('organisation').innerHTML = "Organisation: " + org;
      document.getElementById('host').innerHTML = "Hostname: " + host;

      localStorage.setItem('location', location);
      localStorage.setItem('latitude', latitude);
      localStorage.setItem('longitude', longitude);
      localStorage.setItem('region', region1);
      localStorage.setItem('org', org);
      localStorage.setItem('host', host);
      localStorage.setItem('timeZone', timeZone);
      localStorage.setItem('pincode', pincode);
      localStorage.setItem('city', city);

      document.getElementById('map').setAttribute("src", `https://maps.google.com/maps?q=${data.loc}&z=15&output=embed`);
      
      const currentDate = new Date();
      const options = { timeZone: timeZone };
      const localTime = currentDate.toLocaleString('en-US', options);

      document.getElementById('timezone').innerHTML = "Time Zone: " + timeZone;
      document.getElementById('date').innerHTML = "Date and Time: " + localTime;
      document.getElementById('pincode').innerHTML = "Pincode: " + pincode;
      

      

      return fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
      
      const postOfficeData = data[0];
      const postOffices = postOfficeData.PostOffice;
      const msg = postOfficeData.Message;
      document.getElementById('msg').innerHTML = "Message: " + msg;

      let postOfficeGrid = '<div id="officeGrid" class="row row-cols-2 px-5 gy-5 ">';
      postOffices.forEach(office => {
        postOfficeGrid += `
          <div class="boxes col border border-dark rounded border-2">
            <span>Name: ${office.Name}</span>
            <p>Branch Type: ${office.BranchType}</p>
            <p>Delivery Status: ${office.DeliveryStatus}</p>
            <p>District: ${office.District}</p>
            <p>Division: ${office.Division}</p>
          </div>
        `;
      });
      postOfficeGrid += '</div>';

      document.getElementById('results').innerHTML = postOfficeGrid;
      submitbtn.style.display = 'none';
      document.getElementById('serchbox').style.display = "";
      ipdata.style.display = 'block';
    })
    .catch(error => {
      console.error(error);
    });
  }

const searchOffice = ()=>{
    let filter = document.getElementById("myInput").value.toUpperCase();
    let myOffices = document.getElementById("officeGrid");
    let div = myOffices.getElementsByTagName('div');

    for(var i=0;i<div.length; i++){
        let names = div[i].getElementsByTagName('span')[0].innerHTML.substring(6);

        if(names){
            let innerdata = names;
            
            if(innerdata.toUpperCase().indexOf(filter)>-1){
                div[i].style.display = "";
            }
            else{
                div[i].style.display = "none";
            }
        }
    }
}