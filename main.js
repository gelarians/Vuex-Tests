"use strict"

// #################### VUEX ##############################################
const state = {
    notes: [
        {
            note: "Das ist eine Notitz",
            timestamp: new Date().toLocaleString(),
        }
    ]
}

const getters = {
    getNotes (){
        return state.notes
    },
    getNoteCount(){
        return state.notes.length;
    }
}
// mutations bekommen immer ein state und ein payload | payload kann 
// alles sein meistens ist es ein objekt {}
const mutations = {
    STORE_NOTE (state, payload){
        state.notes.push(payload)
    },
    REMOVE_NOTE (state, index){
        state.notes.splice(index, 1)
    }
}

// actions bekommen immer ein context und ein payload | payload kann 
// alles sein meistens ist es ein objekt {}
const actions = {
    storeNote(context, payload){
        context.commit("STORE_NOTE", payload)
    },
    removeNote(context, timestamp){
        const index = context.state.notes.findIndex(note => note.timestamp === timestamp)
        context.commit("REMOVE_NOTE", index)
    }
}

// Vuex initalisieren
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})


// #################### Component: NoteCount ##############################
const NoteCountComponent = {
    template: `
    <div> 
        <div>Anzahl der Notitzen: <strong> {{ noteCount }}</strong></div>
    </div>   
    `,
    computed: {
        noteCount(){
            return this.$store.getters.getNoteCount
        },

    }
}

// #################### Component: Input ##################################
const InputComponent = {
    template: `
                    <input 
                        type="text" 
                        class="form-control"
                        v-bind:placeholder="placeholder"
                        v-model="note"
                        @keyup.enter="submitNote"
                    >
    `,
    props: ["placeholder"],
    data() {
        return {
            note: ""
        }
    },
    methods: {
        // Custom event!
        submitNote(){
            const payload = {
                note: this.note,
                timestamp: new Date().toLocaleString()
            }
            //actions aufrufen
            this.$store.dispatch("storeNote", payload)
            this.note = ""
        }
    }
}

// #################### Vue Init ##############################

new Vue({
    el: "#app",
    store,
    components: {
        "input-component": InputComponent,
        "note-count-component": NoteCountComponent
    },
    data: {

        placeholder: "enter new note"
    },
    computed: {
        notes(){
            // talk to vuex getter
            return this.$store.getters.getNotes
        }
    },
    methods: {
        deleteNote(noteTimestamp){
            this.$store.dispatch("removeNote", noteTimestamp)
        }
    }
    

})