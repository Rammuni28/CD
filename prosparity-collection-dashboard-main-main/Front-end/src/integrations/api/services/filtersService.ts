import { API_BASE_URL, getAuthHeaders } from '../client';

// Types for filters data - Updated to match actual backend response
export interface FiltersOptionsResponse {
  emi_months: string[];
  branches: string[];
  dealers: string[];
  lenders: string[];
  statuses: string[];
  ptpDateOptions: string[];
  vehicle_statuses: string[];
  team_leads: string[];
  rms: string[];
  demand_num: string[]; // Added to match backend API response
}

// Filters Service
export class FiltersService {
  // GET /api/v1/filters/options - Get all filter options
  static async getFilterOptions(): Promise<FiltersOptionsResponse> {
    const response = await fetch(`${API_BASE_URL}/filters/options`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch filter options: ${response.status}`);
    }

    return await response.json();
  }

  // Helper method to get EMI months only
  static async getEMIMonths(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.emi_months;
  }

  // Helper method to get branches only
  static async getBranches(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.branches;
  }

  // Helper method to get dealers only
  static async getDealers(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.dealers;
  }

  // Helper method to get lenders only
  static async getLenders(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.lenders;
  }

  // Helper method to get statuses only
  static async getStatuses(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.statuses;
  }

  // Helper method to get PTP date options only
  static async getPTPDateOptions(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.ptpDateOptions;
  }

  // Helper method to get vehicle statuses only
  static async getVehicleStatuses(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.vehicle_statuses;
  }

  // Helper method to get team leads only
  static async getTeamLeads(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.team_leads;
  }

  // Helper method to get RMs only
  static async getRMs(): Promise<string[]> {
    const options = await this.getFilterOptions();
    return options.rms;
  }

  // Helper method to get all filter options as a single object
  static async getAllFilterOptions(): Promise<FiltersOptionsResponse> {
    return await this.getFilterOptions();
  }

  // Helper method to get filter options for specific filter types
  static async getFilterOptionsByType(filterTypes: (keyof FiltersOptionsResponse)[]): Promise<Partial<FiltersOptionsResponse>> {
    const allOptions = await this.getFilterOptions();
    const selectedOptions: Partial<FiltersOptionsResponse> = {};
    
    filterTypes.forEach(type => {
      if (allOptions[type]) {
        selectedOptions[type] = allOptions[type];
      }
    });
    
    return selectedOptions;
  }
}
