import { useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

export default function App() {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        UIkit.use(Icons);
    }, []);

    return <Dashboard />;
}

