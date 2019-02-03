<script>
  import { mapState } from 'vuex'

  export default {
    props: {
      animalId: {
        type: String,
        default: null,
      },
    },

    data() {
      return {
        animal: {
          name: '',
          birthdate: new Date(),
          species: '',
          arrival: new Date(),
          feedingDuration: null,
          lastFed: null,
        }
      }
    },

    created() {
      if(this.animalId) {
        this.$database.getAnimalData(this.uid, this.animalId)
        .then(doc => {
          this.animal = doc.data();
          this.animal.birthdate = new Date(this.animal.birthdate);
          this.animal.arrival = new Date(this.animal.arrival);
        })
        .catch(err => {
          console.error(err);
          this.alert(err);
        });
      }
    },

    computed: {
      ...mapState([
        'uid',
      ]),

      newAnimal() {
        return !this.animalId;
      },

      valid() {
        return !!this.animal.name;
      },

      buttonText() {
        return this.newAnimal ? 'Add' : 'Save';
      },
    },

    methods: {
      addAnimal() {
        if(this.newAnimal) {
          this.$database.addAnimal(this.uid, this.animal)
          .then(documentRef  => {
            console.log(`Added animal with ID ${documentRef.id}`);
            this.goBack();
          })
          .catch(err => {
            console.error(err);
            this.alert(err);
          });
        }
        else {
          this.$database.updateAnimal(this.uid, this.animalId, this.animal)
          .then(() => {
            this.goBack();
          })
          .catch(err => {
            console.error(err);
            this.alert(err);
          });
        }
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
            <TextField v-model="animal.name" hint="Enter animal's name..." />
          </StackLayout>

          <StackLayout class="form-field" marginBottom="20">
            <Label class="label" text="Species" />
            <TextField v-model="animal.species" hint="Enter species name..." />
          </StackLayout>

          <StackLayout  class="form-field" marginBottom="20">
            <Label class="label" text="Feeding Duration" />
            <TextField v-model="animal.feedingDuration" keyboardType="number" hint="Every (x) days" />
          </StackLayout>

          <StackLayout class="form-field">
            <Label class="label" text="Birthdate" />
            <DatePicker v-model="animal.birthdate" />
          </StackLayout>

          <StackLayout class="form-field">
            <Label class="label" text="Arrival Date" />
            <DatePicker v-model="animal.arrival" />
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
