<script>
  import { mapState } from 'vuex'

  export default {
    props: {
      animalId: {
        type: String,
        default: '0',
      },

      eventId: {
        type: String,
        default: null,
      },

      eventType: {
        type: String,
        default: 'Feeding',
      },
    },

    data() {
      return {
        event: {
          timestamp: new Date(),
          value: null,
          notes: '',
          type: this.eventType,
        },
        tempTime: new Date(),
        oldTimestamp: null,
        animal: {},
      }
    },

    created() {
      if(this.eventId) {
        this.$database.getEventData(this.uid, this.animalId, this.eventId)
        .then(doc => {
          this.event = doc.data();
          this.event.timestamp = new Date(this.event.timestamp);
          let newTime = new Date();
          newTime.setHours(this.event.timestamp.getHours());
          newTime.setMinutes(this.event.timestamp.getMinutes());
          this.tempTime = newTime;
          this.oldTimestamp = new Date(this.event.timestamp);
        })
        .catch(err => {
          console.error(err);
          this.alert(err);
        });
      }

      this.$database.getAnimalData(this.uid, this.animalId)
      .then(doc => {
        this.animal = doc.data();
      })
      .catch(err => {
        console.error(err);
        this.alert(err);
      });
    },

    computed: {
      ...mapState([
        'uid',
      ]),

      newEvent() {
        return !this.eventId;
      },

      buttonText() {
        return this.newEvent ? 'Add' : 'Save';
      },

      action() {
        return this.newEvent ? 'Add' : 'Edit';
      },

      animalName() {
        if(this.animal && this.animal.name) {
          return `${this.action} ${this.event.type} Event for ${this.animal.name}`;
        }
        else {
          return `${this.action} ${this.event.type} Event`;
        }
      },
    },

    methods: {
      updateTime() {
        this.event.timestamp.setHours(this.tempTime.getHours())
        this.event.timestamp.setMinutes(this.tempTime.getMinutes())
      },

      submit() {
        this.updateTime();

        if(this.newEvent) {
          this.$database.addEvent(this.uid, this.animalId, this.event)
          .then(documentRef  => {
            console.log(`Added event with ID ${documentRef.id}`);
            this.goBack();
          })
          .catch(err => {
            console.error(err);
            this.alert(err);
          });
        }
        else {
          this.$database.updateEvent(this.uid, this.animalId, this.eventId, this.event)
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
        <Label class="title" :text="animalName"  col="1"/>
      </GridLayout>
    </ActionBar>

    <FlexboxLayout flexDirection="column" justifyContent="space-between">
      <ScrollView>
        <StackLayout>
          <StackLayout class="form-field">
            <Label class="label" text="Date" />
            <DatePicker v-model="event.timestamp" />
          </StackLayout>

          <StackLayout class="form-field">
            <Label class="label" text="Time" />
            <TimePicker v-model="tempTime" />
          </StackLayout>

          <StackLayout v-if="event.type === 'Weight'" class="form-field" marginBottom="20">
            <Label class="label" text="Weight" />
            <TextField v-model="event.value" keyboardType="number" hint="In grams" />
          </StackLayout>
          <StackLayout v-else-if="event.type === 'Handling'" class="form-field" marginBottom="20">
            <Label class="label" text="Duration" />
            <TextField v-model="event.value" keyboardType="number" hint="In minutes" />
          </StackLayout>

          <StackLayout class="form-field" marginBottom="20">
            <Label class="label" text="Notes" />
            <TextField v-model="event.notes" hint="Notes..." />
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <Button class="btn btn-primary" :text="buttonText" flexShrink="0" @tap="submit" />
    </FlexboxLayout>
  </Page>
</template>
