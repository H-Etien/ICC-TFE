import Header from "../components/layout/Header";
import MainGrid from "../components/layout/MainGrid";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "../styles/customizations";

import PageLayout from "../components/layout/PageLayout";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function Project(props: { disableCustomTheme?: boolean }) {
    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header />
        </PageLayout>
    );
}
