import firebase from "nativescript-plugin-firebase";
import store from '../store/index'

export default class DataService {
  getUserData() {
    firebase.getCurrentUser().then(function(currentuser) {
      firebase.firestore.getDocument("users", currentuser.uid).then(docdata => {
        var userdata = {
          uid: currentuser.uid,
          dataLoaded: true,
        };

        if (!docdata.exists) {
          firebase.firestore.set("users", currentuser.uid, {});
        }

        store.commit("loadUserData", userdata);
      });
    });
  }

  resetUserData(uid) {
    this.animalsCollection().get(snapshot => {
      snapshot.forEach(doc => {
        doc.delete();
      })
    });
  }

  animalsCollection(uid) {
    return firebase.firestore.collection('users').doc(uid).collection('animals');
  }

  async getAnimals(uid) {
    return await this.animalsCollection(uid).get();
  }

  async getAnimalData(uid, animalId) {
    return await this.animalsCollection(uid).doc(animalId).get();
  }

  async addAnimal(uid, animalData) {
    return await this.animalsCollection(uid).add(animalData);
  }

  async setAnimal(uid, animalId, animalData) {
    return await this.animalsCollection(uid).doc(animalId).set(animalData);
  }

  async updateAnimal(uid, animalId, animalData) {
    return await this.animalsCollection(uid).doc(animalId).update(animalData);
  }

  async deleteAnimal(uid, animalId) {
    return await this.animalsCollection(uid).doc(animalId).delete();
  }

  eventsCollection(uid, animalId) {
    return this.animalsCollection(uid).doc(animalId).collection('events');
  }

  async getEventData(uid, animalId, eventId) {
    return await this.eventsCollection(uid, animalId).doc(eventId).get();
  }

  async addEvent(uid, animalId, eventData) {
    return await this.eventsCollection(uid, animalId).add(eventData);
  }

  async setEvent(uid, animalId, eventId, eventData) {
    return await this.eventsCollection(uid, animalId).doc(eventId).set(eventData);
  }

  async updateEvent(uid, animalId, eventId, eventData) {
    return await this.eventsCollection(uid, animalId).doc(eventId).update(eventData);
  }

  async deleteEvent(uid, animalId, eventId) {
    return await this.eventsCollection(uid, animalId).doc(eventId).delete();
  }

  async getLastFed(uid, animalId) {
    return await this.eventsCollection(uid, animalId).where("type", "==", "Feeding").orderBy("timestamp", "desc").limit(1).get();
  }
};
