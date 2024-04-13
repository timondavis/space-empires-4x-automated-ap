import React, {useEffect, useReducer} from "react";
import {AP} from "../../Model/AP";
import {ApRoutingContext} from "../../Context/ApRoutingContext";
import {StorageService} from "../../Service/StorageService/StorageService";

const defaultState = {
    apCollection : [new AP(0, 5, 'none')],
    featuredAp : null,
    currentAp : null,
    isGameStarted : false,
    isResetGameProposed : false,
};

const getInitialState = () => {
    let state = StorageService.getInstance().getData('ApRoutingProvider');
    return (state) ? state : defaultState;
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
       case ('start_game'):
            return startGame(state);
       case ('propose_reset'):
            return proposeReset(state);
       case ('cancel_reset'):
            return cancelReset(state);
       case ('reset') :
           return reset();
       default:
           return state;
   }
}

export const ApRoutingProvider = ({children}) => {
    const [state, dispatch] = useReducer( reducer, getInitialState() );

    useEffect(() => {
        StorageService.getInstance().storeData('ApRoutingProvider', state)
    }, [state]);

    return (
        <ApRoutingContext.Provider value={{
            apCollection: state.apCollection,
            featuredAp: state.featuredAp,
            currentAp: state.currentAp,
            isGameStarted: state.isGameStarted,
            isResetGameProposed: state.isResetGameProposed,
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
    const nextId = (!state.currentAp || state.currentAp.id + 1 >= state.apCollection.length) ?
        0 : state.currentAp.id + 1;
    return {
        ...state,
        currentAp : state.apCollection[nextId]
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
        featuredAp: value?.ap
    }
}

const removeAp = (state,value) => {
    if ( state.apCollection.length <= 1 ) { return {...state}; }

    let updatedCollection = [ ...state.apCollection ];
    updatedCollection.splice(value.ap.id, 1);

    let currentAp = state.currentAp;
    let featuredAp = state.featuredAp;

    updatedCollection = updatedCollection.map((ap, idx) => {
        ap.id = idx;
        return ap;
    });

    if (state.currentAp?.id === value.ap.id) {
        currentAp = (value.ap.id < updatedCollection.length - 1) ? updatedCollection[value.ap.id] : updatedCollection[0];
    }

    if (state.featuredAp?.id === value.ap.id) {
        featuredAp = (value.ap.id < updatedCollection.length - 1) ? updatedCollection[value.ap.id] : updatedCollection[0];
    }

    return {
        ...state,
        apCollection: updatedCollection,
        currentAp: currentAp,
        featuredAp: featuredAp
    };
}

const reset = () => {
    StorageService.getInstance().clearData('ApRoutingProvider');
    return defaultState;
}

const startGame = (state) => {

    let newState = {...state};

    state.apCollection.forEach(ap => {
        if ( ap.color === 'none' ) {
            newState = removeAp(newState, {ap: ap});
        }
    });

    newState = featureAp(newState, {ap: newState.apCollection[0]});
    newState = advanceApTurn(newState);

    return {
        ...newState,
        isGameStarted: true
    };
}

const proposeReset = (state) => {
    return {
        ...state,
        isResetGameProposed : true
    };
}

const cancelReset = (state) => {
    return {
        ...state,
        isResetGameProposed : false
    }
}