import React, {useReducer} from "react";
import {AP} from "../Model/AP";
import {ApRoutingContext} from "../Context/ApRoutingContext";

const initialState = {
    apCollection : [new AP(0, 5, 'none')],
    featuredApId : 0,
    currentApId : 0
}

const reducer = (state, action) => {
   switch(action.type) {
       case ('add_ap') :
           return addAp(state, action.value);
       case ('advance_ap_turn') :
           return advanceApTurn(state);
       case ('update_ap') :
           return updateAp(state, action.value);
       case ('remove_ap') :
            return removeAp(state, action.value);
       case ('feature_ap') :
           return featureAp(state, action.value);
   }
}

export const ApRoutingProvider = ({children}) => {
    const [state, dispatch] = useReducer( reducer, initialState );

    return (
        <ApRoutingContext.Provider value={{
            apCollection: state.apCollection,
            featuredAp: (state.apCollection.length > 0) ? state.apCollection[state.featuredApId] : null,
            currentAp: (state.apCollection.length > 0) ? state.apCollection[state.currentApId] : null,
            dispatch: dispatch
        }}>
            {children}
        </ApRoutingContext.Provider>
    );
}

const addAp = (state, value) => {
    const aps = [ ...state.apCollection ];
    const index = aps.length;

    const invalidAps = aps.filter((ap) => {
        return ap.color === 'none';
    });

    if ( index <= 2 && invalidAps.length === 0 ) {
        aps[index] = new AP(index,5,'none');
    }

    return {
        ...state,
        apCollection: aps
    };
}

const advanceApTurn = (state) => {
    const nextId = (state.currentApId + 1 > state.apCollection.length) ? 0 : state.currentApId + 1;
    return {
        ...state,
        currentApiId : nextId
    };
}

const updateAp = (state, value) => {
    let updatedCollection = [...state.apCollection];

    updatedCollection[value?.ap.id] = value?.ap;

    return {
        ...state,
        apCollection: updatedCollection
    }
}

const featureAp = (state, value) => {
    return {
        ...state,
        featuredApId: value?.ap.id
    }
}

const removeAp = (state,value) => {
    if ( state.apCollection.length <= 1 ) { return {...state}; }

    let updatedCollection = [ ...state.apCollection ];
    updatedCollection.splice(value.ap.id, 1);

    updatedCollection = updatedCollection.map((ap, idx) => {
        ap.id = idx;
        return ap;
    });

    return {
        ...state,
        apCollection: updatedCollection
    };
}