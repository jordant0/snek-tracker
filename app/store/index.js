import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as ApplicationSettings from "application-settings";

Vue.use(Vuex);

function setAnimalData(id, animalData) {
  let newAnimal = {
    id: id,
    name: animalData.name,
    species: animalData.species,
  }

  if(animalData.birthdate) {
    newAnimal.birthdate = {
      day: animalData.birthdate.getDate(),
      month: animalData.birthdate.getMonth(),
      year: animalData.birthdate.getYear() + 1900,
    }
  }
  else {
    newAnimal.birthdate = {}
  }

  if(animalData.arrival) {
    newAnimal.arrival = {
      day: animalData.arrival.getDate(),
      month: animalData.arrival.getMonth(),
      year: animalData.arrival.getYear() + 1900,
    }
  }
  else {
    newAnimal.arrival = {}
  }

  return newAnimal;
};

function setEventData(id, eventData) {
  let newEvent = {
    id: id,
    animalId: eventData.animalId,
    type: eventData.type,
    notes: eventData.notes,
    value: eventData.value,
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

  if(eventData.time) {
    newEvent.time = {
      hour: eventData.time.getHours(),
      minute: eventData.time.getMinutes(),
    }
  }
  else {
    newEvent.time = {}
  }

  return newEvent;
};

const INITIAL_STATE = {
  animals: {
    0: {
      id: 0,
      name: 'Test',
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
      value: null,
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
    },

    getAnimal: (state) => (id) => {
      return state.animals[id];
    },

    getEvent: (state) => (id) => {
      return state.events[id];
    },

    sortedEventIds: state => {
      return Object.keys(state.events).sort((idB, idA) => {
        let eventA = state.events[idA],
            eventB = state.events[idB];

        if (eventA.date.year === eventB.date.year) {
          if (eventA.date.month === eventB.date.month) {
            if (eventA.date.day === eventB.date.day) {
              if(eventA.time && eventB.time) {
                if(eventA.time.hour === eventB.time.hour) {
                  return eventA.time.minute - eventB.time.minute;
                }
                else {
                  return eventA.time.hour - eventB.time.hour;
                }
              }
              else {
                if(eventB.time) {
                  return 1;
                }
                else {
                  return -1;
                }
              }
            }
            else {
              return eventA.date.day - eventB.date.day;
            }
          }
          else {
            return eventA.date.month - eventB.date.month;
          }
        }
        else {
          return eventA.date.year - eventB.date.year;
        }
      });
    },
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

    updateAnimal(state, animalData) {
      Vue.set(state.animals, animalData.id, setAnimalData(animalData.id, animalData));
    },

    removeAnimal(state, id) {
      Vue.delete(state.animals, id);
    },

    addEvent(state, eventData) {
      Vue.set(state.events, state.nextEventId, setEventData(state.nextEventId, eventData));
      state.nextEventId += 1;
    },

    updateEvent(state, eventData) {
      Vue.set(state.events, eventData.id, setEventData(eventData.id, eventData));
    },

    removeEvent(state, id) {
      Vue.delete(state.events, id);
    },
  }
});

Vue.prototype.$store = store;

export default store;
