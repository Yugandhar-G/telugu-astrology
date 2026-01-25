// Supabase database query helpers

import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';
import { SavedChart, SavedMatching } from '@/types/user';

const getSupabase = (client?: SupabaseClient) => client ?? supabase;

// Helper to map DB response to TypeScript interface
function mapChartResponse(row: any): SavedChart {
  return {
    id: row.id,
    userId: row.user_id,
    personName: row.person_name,
    birthData: row.birth_data,
    chartType: row.chart_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSavedCharts(userId: string, client?: SupabaseClient): Promise<SavedChart[]> {
  const supabase = getSupabase(client);
  const { data, error } = await supabase
    .from('saved_charts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapChartResponse);
}

export async function saveChart(
  userId: string,
  personName: string,
  birthData: any,
  chartType: 'kundali' | 'transit' | 'dasha' = 'kundali',
  client?: SupabaseClient
): Promise<SavedChart> {
  const supabase = getSupabase(client);

  console.log('Saving chart:', { userId, personName, chartType });

  const { data, error } = await supabase
    .from('saved_charts')
    .insert({
      user_id: userId,
      person_name: personName,
      birth_data: birthData,
      chart_type: chartType,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase save chart error:', error);
    throw error;
  }

  return mapChartResponse(data);
}

export async function deleteChart(chartId: string, userId: string, client?: SupabaseClient): Promise<void> {
  const supabase = getSupabase(client);
  const { error } = await supabase
    .from('saved_charts')
    .delete()
    .eq('id', chartId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Helper to map DB response for matchings
function mapMatchingResponse(row: any): SavedMatching {
  return {
    id: row.id,
    userId: row.user_id,
    person1ChartId: row.person_1_chart_id,
    person2ChartId: row.person_2_chart_id,
    matchingData: row.matching_data,
    gunaScore: row.guna_score,
    createdAt: row.created_at,
  };
}

export async function getSavedMatchings(userId: string): Promise<SavedMatching[]> {
  const { data, error } = await supabase
    .from('saved_matchings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapMatchingResponse);
}

export async function saveMatching(
  userId: string,
  person1ChartId: string | null,
  person2ChartId: string | null,
  matchingData: any,
  gunaScore: number
): Promise<SavedMatching> {
  const { data, error } = await supabase
    .from('saved_matchings')
    .insert({
      user_id: userId,
      person_1_chart_id: person1ChartId,
      person_2_chart_id: person2ChartId,
      matching_data: matchingData,
      guna_score: gunaScore,
    })
    .select()
    .single();

  if (error) throw error;
  return mapMatchingResponse(data);
}
