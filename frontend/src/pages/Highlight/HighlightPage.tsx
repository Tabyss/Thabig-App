import { HighlightFormModal } from "../../features/highlight/components/HighlightFormModal";
import { HighlightHeatmap } from "../../features/highlight/components/HighlightHeatmap";
import { HighlightMonthList } from "../../features/highlight/components/HighlightMonthList";

const Highlight = () => {
    return (
        <div className="max-w-6xl p-6 mx-auto bg-gray-50 min-h-screen">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Activity Highlights
            </h1>

            <HighlightHeatmap />

            <HighlightMonthList />

            <HighlightFormModal />
        </div>
    );
};

export default Highlight;
