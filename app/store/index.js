import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as ApplicationSettings from "application-settings";

Vue.use(Vuex);

function setAnimalData(id, animalData) {
  let newAnimal = {
    id: id,
    name: animalData.name,
    type: animalData.type,
    species: animalData.species,
  }

  if(animalData.date) {
    newAnimal.birthdate = {
      day: animalData.date.getDate(),
      month: animalData.date.getMonth(),
      year: animalData.date.getYear() + 1900,
    }
  }
  else {
    newAnimal.birthdate = {}
  }

  return newAnimal;
};

function setEventData(id, eventData) {
  let newEvent = {
    id: id,
    animalId: eventData.animalId,
    type: eventData.type,
    notes: eventData.notes,
    time: eventData.time,
  }

  if(eventData.date) {
    newEvent.date = {
      day: eventData.date.getDate(),
      month: eventData.date.getMonth(),
      year: eventData.date.getYear() + 1900,
    }
  }
  else {
    newEvent.date = {}
  }

  return newEvent;
};

const INITIAL_STATE = {
  animals: {
    0: {
      id: 0,
      name: 'Test',
      type: 'Unknown',
      species: null,
      birthdate: {
        day: 1,
        month: 0,
        year: 1960,
      },
    }
  },
  nextAnimalId: 1,
  test: 'Test text',
  events: {
    0: {
      id: 0,
      animalId: 0,
      type: 'Feeding',
      date: {
        day: 1,
        month: 0,
        year: 1960,
      },
      time: {
        hour: 0,
        minute: 0,
      },
      notes: 'Test',
    },
  },
  nextEventId: 1,
}

const store = new Vuex.Store({
  state: Object.assign({}, INITIAL_STATE),

  getters: {
    animalsList: state => {
      return Object.values(state.animals);
    }
  },

  mutations: {
    load(state) {
      if(ApplicationSettings.getString("store")) {
        this.replaceState(
          Object.assign(state, JSON.parse(ApplicationSettings.getString("store")))
        );
      }
    },

    reset(state) {
      this.replaceState(
        Object.assign(state, INITIAL_STATE)
      );
    },

    addAnimal(state, animalData) {
      Vue.set(state.animals, state.nextAnimalId, setAnimalData(state.nextAnimalId, animalData));
      state.nextAnimalId += 1;
    },

    updateAnimal(state, { id, animalData }) {
      Vue.set(state.animals, id, setAnimalData(id, animalData));
    },

    removeAnimal(state, { id }) {
      Vue.delete(state.animals, id);
    },

    aAddEvent(state, { eventData }) {
      Vue.set(state.events, state.nextEventId, setEventData(state.nextEventId, eventData));
      state.nextEventId += 1;
    },

    updateEvent(state, { id, eventData }) {
      Vue.set(state.events, id, setEventData(id, eventData));
    },

    removeEvent(state, { id }) {
      Vue.delete(state.events, id);
    },
  }
});

Vue.prototype.$store = store;

export default store;
