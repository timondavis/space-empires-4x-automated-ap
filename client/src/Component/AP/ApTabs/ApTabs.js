import React, {useContext} from "react";
import {ApRoutingContext} from "../../../Context/ApRoutingContext";
import {ApTab} from "../ApTab/ApTab";

export const ApTabs = () => {

    const {apCollection, featuredAp, currentAp, dispatch } = useContext(ApRoutingContext)

    const getNonFeaturedAps = () => apCollection.filter(ap => ap.id !== featuredAp.id );

    return (
        <div className={"wp-tabs w-100 d-flex gx-2"}>
            {getNonFeaturedAps().map(ap =>
                <ApTab
                    key={`ap-tab-${ap.id}`}
                    ap={ap}
                >
                </ApTab>
            )}
        </div>
    );
}