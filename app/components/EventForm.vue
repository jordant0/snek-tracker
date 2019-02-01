<script>
  export default {
    props: {
      eventAnimalId: {
        type: Number,
        default: 0,
      },

      eventId: {
        type: Number,
        default: 0,
      },

      eventType: {
        type: String,
        default: 'Feeding',
      },
    },

    data() {
      if(!this.eventId) {
        return {
          date: new Date(),
          time: new Date(),
          value: null,
          notes: '',
          type: this.eventType,
          animalId: this.eventAnimalId,
          dateUpdated: true,
        }
      } else {
        let event = this.$store.getters.getEvent(this.eventId),
            date = event.date || {},
            time = new Date();

        if(event.time) {
          time.setHours(event.time.hour);
          time.setMinutes(event.time.minute);
        }

        return {
          date: new Date(date.year, date.month, date.day),
          time,
          value: event.value,
          notes: event.notes,
          type: event.type,
          animalId: event.animalId,
          dateUpdated: false,
        }
      }
    },

    watch: {
      date: {
        deep: true,
        handler() {
          this.dateUpdated = true;
        },
      },
    },

    computed: {
      newEvent() {
        return !this.eventId;
      },

      animal() {
        return this.$store.getters.getAnimal(this.animalId);
      },

      buttonText() {
        return this.newEvent ? 'Add' : 'Save';
      },

      action() {
        return this.newEvent ? 'Add' : 'Edit';
      },

      animalName() {
        if(this.animal && this.animal.name) {
          return `${this.action} ${this.type} Event for ${this.animal.name}`;
        }
        else {
          return `${this.action} ${this.type} Event`;
        }
      },
    },

    methods: {
      submit() {
        let eventData = {
          animalId: this.animalId,
          type: this.type,
          date: this.date,
          time: this.time,
          value: this.value,
          notes: this.notes,
        };

        if(this.newEvent) {
          this.$store.commit('addEvent', eventData);
        } else {
          eventData.id = this.eventId;
          this.$store.commit('updateEvent', eventData);
        }

        if(eventData.type === 'Feeding' && this.dateUpdated) {
          this.$store.commit('recalculateLastFed', this.animalId);
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
        <Label class="title" :text="animalName"  col="1"/>
      </GridLayout>
    </ActionBar>

    <FlexboxLayout flexDirection="column" justifyContent="space-between">
      <ScrollView>
        <StackLayout>
          <StackLayout class="form-field">
            <Label class="label" text="Date" />
            <DatePicker v-model="date" />
          </StackLayout>

          <StackLayout class="form-field">
            <Label class="label" text="Time" />
            <TimePicker v-model="time" />
          </StackLayout>

          <StackLayout v-if="type === 'Weight'" class="form-field" marginBottom="20">
            <Label class="label" text="Weight" />
            <TextField v-model="value" keyboardType="number" hint="In grams" />
          </StackLayout>
          <StackLayout v-else-if="type === 'Handling'" class="form-field" marginBottom="20">
            <Label class="label" text="Duration" />
            <TextField v-model="value" keyboardType="number" hint="In minutes" />
          </StackLayout>

          <StackLayout class="form-field" marginBottom="20">
            <Label class="label" text="Notes" />
            <TextField v-model="notes" hint="Notes..." />
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <Button class="btn btn-primary" :text="buttonText" flexShrink="0" @tap="submit" />
    </FlexboxLayout>
  </Page>
</template>
