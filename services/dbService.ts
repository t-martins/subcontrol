import { BrandProfile, GeneratedArt } from "../types";
import { supabase } from "./supabaseClient";

export class DatabaseService {
  private isInitialized = false;

  async init(): Promise<void> {
    // Verifica conexão com Supabase
    try {
      const { error } = await supabase.from('brand_profiles').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') { // PGRST116 = tabela vazia, não é erro
        throw error;
      }
      this.isInitialized = true;
    } catch (err) {
      console.error('Erro ao conectar ao Supabase:', err);
      throw new Error('Falha ao conectar ao banco de dados Supabase');
    }
  }

  async saveBrand(brand: BrandProfile): Promise<void> {
    try {
      // Primeiro, verifica se já existe um perfil
      const { data: existing } = await supabase
        .from('brand_profiles')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        // Atualiza o perfil existente
        const { error } = await supabase
          .from('brand_profiles')
          .update({
            name: brand.name,
            logo: brand.logo,
            summary: brand.summary,
            colors: brand.colors,
            typography: brand.typography,
            visual_style: brand.visualStyle,
            expert_references: brand.expertReferences,
            product_references: brand.productReferences,
            references: brand.references,
            gallery: brand.gallery,
            saved_styles: brand.savedStyles,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Cria um novo perfil
        const { error } = await supabase
          .from('brand_profiles')
          .insert({
            name: brand.name,
            logo: brand.logo,
            summary: brand.summary,
            colors: brand.colors,
            typography: brand.typography,
            visual_style: brand.visualStyle,
            expert_references: brand.expertReferences,
            product_references: brand.productReferences,
            references: brand.references,
            gallery: brand.gallery,
            saved_styles: brand.savedStyles
          });

        if (error) throw error;
      }
    } catch (err) {
      console.error('Erro ao salvar perfil da marca:', err);
      throw err;
    }
  }

  async getBrand(): Promise<BrandProfile | null> {
    try {
      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Nenhum registro encontrado
          return null;
        }
        throw error;
      }

      if (!data) return null;

      // Converte os dados do Supabase para o formato BrandProfile
      return {
        name: data.name,
        logo: data.logo,
        summary: data.summary,
        colors: data.colors || [],
        typography: data.typography,
        visualStyle: data.visual_style,
        expertReferences: data.expert_references || [],
        productReferences: data.product_references || [],
        references: data.references || [],
        gallery: data.gallery || [],
        savedStyles: data.saved_styles || []
      };
    } catch (err) {
      console.error('Erro ao buscar perfil da marca:', err);
      return null;
    }
  }

  async saveArt(art: GeneratedArt): Promise<void> {
    try {
      const { error } = await supabase
        .from('art_history')
        .upsert({
          id: art.id,
          urls: art.urls,
          prompt: art.prompt,
          timestamp: art.timestamp,
          style_name: art.styleName
        });

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao salvar arte:', err);
      throw err;
    }
  }

  async getHistory(): Promise<GeneratedArt[]> {
    try {
      const { data, error } = await supabase
        .from('art_history')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (!data) return [];

      // Converte os dados do Supabase para o formato GeneratedArt
      return data.map(item => ({
        id: item.id,
        urls: item.urls || [],
        prompt: item.prompt,
        timestamp: item.timestamp,
        styleName: item.style_name
      }));
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      return [];
    }
  }

  async deleteArt(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('art_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao deletar arte:', err);
      throw err;
    }
  }

  async clearHistory(): Promise<void> {
    try {
      const { error } = await supabase
        .from('art_history')
        .delete()
        .neq('id', ''); // Deleta todos os registros

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao limpar histórico:', err);
      throw err;
    }
  }

  async clearAll(): Promise<void> {
    try {
      // Limpa histórico de arte
      await this.clearHistory();

      // Limpa perfil da marca
      const { error } = await supabase
        .from('brand_profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos os registros

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao limpar todos os dados:', err);
      throw err;
    }
  }

  async exportBackup(): Promise<string> {
    const brand = await this.getBrand();
    const history = await this.getHistory();
    return JSON.stringify({ brand, history, exportDate: Date.now() });
  }

  async importBackup(jsonString: string): Promise<{ brand: BrandProfile; history: GeneratedArt[] }> {
    const data = JSON.parse(jsonString);
    if (!data.brand) throw new Error("Backup inválido");

    await this.saveBrand(data.brand);
    if (Array.isArray(data.history)) {
      for (const art of data.history) {
        await this.saveArt(art);
      }
    }
    return { brand: data.brand, history: data.history || [] };
  }
}

export const dbService = new DatabaseService();
