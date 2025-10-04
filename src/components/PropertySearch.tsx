import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
const PropertySearch = () => {
  const [activeTab, setActiveTab] = useState('Buy');
  const [searchQuery, setSearchQuery] = useState('');
  const tabs = [{
    label: 'Buy',
    value: 'Buy'
  }, {
    label: 'Rent',
    value: 'Rent'
  }, {
    label: 'New Launch',
    value: 'New Launch',
    hasNotification: true
  }, {
    label: 'PG / Co-living',
    value: 'PG'
  }, {
    label: 'Commercial',
    value: 'Commercial'
  }, {
    label: 'Plots/Land',
    value: 'Plots'
  }, {
    label: 'Projects',
    value: 'Projects'
  }];
  return <div className="w-full max-w-6xl mx-auto">
      {/* Property Type Tabs */}
      <div className="bg-white rounded-t-xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap border-b">
          {tabs.map(tab => <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={cn("relative px-6 py-4 text-sm font-medium transition-colors hover:bg-muted/50", activeTab === tab.value ? "text-primary border-b-2 border-primary bg-background" : "text-muted-foreground")}>
              {tab.label}
              {tab.hasNotification && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>}
            </button>)}
        </div>

        {/* Search Section */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Property Type Dropdown */}
            <div className="relative">
              <select className="appearance-none border border-border rounded-lg px-4 py-3 pr-8 text-sm font-medium min-w-[160px] focus:outline-none focus:ring-2 focus:ring-ring bg-rose-950">
                <option>All Residential</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Plot</option>
                <option>Office</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search '3 BHK for sale in Mumbai'" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 pr-20 py-3 text-base border-border focus:ring-2 focus:ring-ring" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <MapPin className="w-4 h-4 text-primary" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <Mic className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>

            {/* Search Button */}
            <Button size="lg" className="px-8 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-medium">
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default PropertySearch;