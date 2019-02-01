<script>
  export default {
    props: {
      animalId: {
        type: Number,
        default: 0,
      },
    },

    data() {
      if(!this.animalId) {
        return {
          name: '',
          birthdate: new Date(),
          species: '',
          arrival: new Date(),
          feedingDuration: null,
          lastFed: null,
        }
      } else {
        let animal = this.$store.getters.getAnimal(this.animalId),
            birthdate = animal.birthdate || {},
            arrival = animal.arrival || {};

        return {
          name: animal.name,
          birthdate: new Date(birthdate.year, birthdate.month, birthdate.day),
          species: animal.species,
          arrival: new Date(arrival.year, arrival.month, arrival.day),
          feedingDuration: animal.feedingDuration,
          lastFed: animal.lastFed,
        }
      }
    },

    computed: {
      newAnimal() {
        return !this.animalId;
      },

      valid() {
        return !!this.name;
      },

      buttonText() {
        return this.newAnimal ? 'Add' : 'Save';
      },
    },

    methods: {
      addAnimal() {
        let animalData = {
          name: this.name,
          birthdate: this.birthdate,
          species: this.species,
          arrival: this.arrival,
          feedingDuration: this.feedingDuration,
          lastFed: this.lastFed,
        };

        if(this.newAnimal) {
          this.$store.commit('addAnimal', animalData);
        }
        else {
          animalData.id = this.animalId;
          this.$store.commit('updateAnimal', animalData);
        }

        this.goBack();
      },

      goBack() {
        this.$navigateBack();
      },
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *">
        <Label class="icon" :text="String.fromCharCode(0xf2fa)" @tap="goBack" col="0" />
        <Label class="title" text="Add Animal"  col="1"/>
      </GridLayout>
    </ActionBar>

    <FlexboxLayout flexDirection="column" justifyContent="space-between">
      <ScrollView>
        <StackLayout>
          <StackLayout class="form-field" marginBottom="20">
            <Label class="label" text="Name" />
            <TextField v-model="name" hint="Enter animal's name..." />
          </StackLayout>

          <StackLayout class="form-field" marginBottom="20">
            <Label class="label" text="Species" />
            <TextField v-model="species" hint="Enter species name..." />
          </StackLayout>

          <StackLayout  class="form-field" marginBottom="20">
            <Label class="label" text="Feeding Duration" />
            <TextField v-model="feedingDuration" keyboardType="number" hint="Every (x) days" />
          </StackLayout>

          <StackLayout class="form-field">
            <Label class="label" text="Birthdate" />
            <DatePicker v-model="birthdate" />
          </StackLayout>

          <StackLayout class="form-field">
            <Label class="label" text="Arrival Date" />
            <DatePicker v-model="arrival" />
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <Button
        class="btn btn-primary"
        flexShrink="0"
        :text="buttonText"
        :isEnabled="valid"
        @tap="addAnimal"
      />
    </FlexboxLayout>
  </Page>
</template>
