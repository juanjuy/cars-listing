const cars = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

class Model {
  constructor() {
    this.cars = cars;
  }

  filterList({make, model, price, year}) {
    let cars = this.cars;

    if (make !== "null") {
      cars = cars.filter(car => car.make === make);
    }

    if (model !== "null") {
      cars = cars.filter(car => car.model === model);
    }

    if (price !== "null") {
      cars = cars.filter(car => car.price === Number(price));
    }

    if (year !== "null") {
      cars = cars.filter(car => car.year === Number(year));
    }

    return cars;
  }

  getModelsOfMake(make) {
    let carsOfMake = this.cars.filter(car => car.make === make);

    let models = this.removeDupes(carsOfMake.map(car => car.model));

    return models;
  }

  getFilterValues() {
    let makes = this.removeDupes(cars.map(car => car.make));
    let models = this.removeDupes(cars.map(car => car.model));
    let prices = this.removeDupes(cars.map(car => car.price));
    let years = this.removeDupes(cars.map(car => car.year));

    return { makes, models, prices, years };
  }

  removeDupes(array) {
    let valuesSoFar = [];
    return array.filter(val => {
      if (valuesSoFar.includes(val)) {
        return false;
      } else {
        valuesSoFar.push(val);
        return true;
      }
    })
  }
}

class View {
  constructor() {
    this.template = Handlebars.compile($('#carTemplate').html());
    this.$form = $('form');
    this.$make = $('#make');
    this.$model = $('#model');
    this.$price = $('#price');
    this.$year = $('#year');
  }

  generateListings(cars) {
    $('main').empty();
    $('main').html(this.template({ cars: cars }));
  }

  populateFilters({makes, models, prices, years}) {
    this.$make.find('*').not('[value=null]').remove();
    this.$model.find('*').not('[value=null]').remove();
    this.$price.find('*').not('[value=null]').remove();
    this.$year.find('*').not('[value=null]').remove();

    makes.forEach(make => {
      let opt = document.createElement('option');
      opt.value = make;
      opt.textContent = make;
      this.$make.append(opt);
    })

    models.forEach(model => {
      let opt = document.createElement('option');
      opt.value = model;
      opt.textContent = model;
      this.$model.append(opt);
    })

    prices.forEach(price => {
      let opt = document.createElement('option');
      opt.value = price;
      opt.textContent = price;
      this.$price.append(opt);
    })

    years.forEach(year => {
      let opt = document.createElement('option');
      opt.value = year;
      opt.textContent = year;
      this.$year.append(opt);
    })
  }

  bindFilterSubmit(handler) {
    this.$form.on('submit', event => {
      event.preventDefault();
      handler(this.makeFilterObject());
    })
  }

  makeFilterObject() {
    let array = this.$form.serializeArray();
    return {
      make: array[0].value,
      model: array[1].value,
      price: array[2].value,
      year: array[3].value
    }
  }

  updateModelSelect(models) {
    this.$model.empty();
    let allOption = document.createElement('option');
    allOption.value = 'null';
    allOption.textContent = 'All';
    this.$model.append($(allOption));

    for (let model of models) {
      let option = document.createElement('option');
      option.value = model;
      option.textContent = model;
      this.$model.append($(option));
    }
  }

  bindMakeUpdate(handler) {
    this.$make.on('change', event => {
      handler(event.target.value);
    })
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.populateFilters(this.model.getFilterValues());
    this.view.generateListings(this.model.cars);
    this.view.bindFilterSubmit(this.handleFiltering.bind(this));
    this.view.bindMakeUpdate(this.handleMakeChange.bind(this));
  }

  handleFiltering(filterObj) {
    let filteredListings = this.model.filterList(filterObj);
    this.view.generateListings(filteredListings);
  }

  handleMakeChange(newMake) {
    if (newMake === 'null') {
      this.view.populateFilters(this.model.getFilterValues());
    } else {
      let models = this.model.getModelsOfMake(newMake);
      this.view.updateModelSelect(models);
    }
  }
}

$(function() {
  const app = new Controller(new Model(), new View());
});