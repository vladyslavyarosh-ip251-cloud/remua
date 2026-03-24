let services=[];
let orders=[];

async function loadServices() {
  const response = await fetch("./data/services.json");
  const services = await response.json();
}

loadServices();

