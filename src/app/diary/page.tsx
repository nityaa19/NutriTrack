
import { Navbar } from "@/components/layout/Navbar";
import { FoodDiary } from "@/components/food/FoodDiary";
import { FoodDatabaseManager } from "@/components/food/FoodDatabaseManager";

export default function DiaryPage() {
  return (
    <div className="pb-24 md:pt-20">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Nutrition Management</h1>
          <p className="text-muted-foreground">Review your diary and customize the food database.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold px-1">Today's Log</h2>
            <FoodDiary />
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold px-1">Database Customization</h2>
            <FoodDatabaseManager />
          </div>
        </div>
      </div>
    </div>
  );
}
