import { useState } from "react";


function Tabs() {
    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
        setToggleState(index);
    };

    return (
        <div className="tabs-container">
        <div className="bloc-tabs">
            <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
            >
            white cards
            </button>
            <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
            >
            red cards
            </button>
        </div>

        <div className="content-tabs">
            <div
            className={(toggleState === 1 ? "content  active-content" : "content")}
            >
                <div className="scrollmenu hand">
                    <div className="white card">test</div>

                </div>
            </div>

            <div
            className={(toggleState === 2 ? "content  active-content" : "content")}
            >
                <div className="scrollmenu hand">
                    <div className="red card">test</div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Tabs;