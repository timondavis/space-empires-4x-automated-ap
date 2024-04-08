export class ApFormReducer{

    props = null;

    dispatch = async (action, component) => {
        this.props = component.props;
        component.setState(prevState => this.reducer(prevState, action));
    }

    reducer = (state, action) => {
        let history = [];
        switch (action) {
            case 'hide_history': {
                return {
                    ...state,
                    showHistory: false
                };
            }
            case 'show_history': {
                return {
                    ...state,
                    showHistory: true
                };
            }
            case 'hide_future':  {
                return {
                    ...state,
                    showFuture: false
                }
            }
            case 'show_future': {
                return {
                    ...state,
                    showFuture: true
                }
            }
            case 'increment_round':

                history = [ ...state.apHistory ];
                history.push({
                    ...this.props.ap,
                    purchasedTech: [...this.props.ap.purchasedTech]
                });
                const newAp = { ...this.props.ap };

                const newEconTurn = newAp.econTurn + 1;
                newAp.econTurn = newEconTurn;

                this.props.apUpdateCallback(newAp);
                return {
                    ...state,
                    apHistory: history
                };

            default: break;
        }

        throw( "Invalid Action" );
    }

}