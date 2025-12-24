import React from 'react';
import { Category, LinkItem, CategoryType } from '../types';
import { AuthModal } from './modals/AuthModal';
import { AISettingsModal } from './modals/AISettingsModal';
import { CategoryModal } from './modals/CategoryModal';
import { AddLinkModal } from './modals/AddLinkModal';
import { ImportConfirmModal } from './modals/ImportConfirmModal';
import { ManualImportModal } from './modals/ManualImportModal';
import { HelpModal } from './modals/HelpModal';

interface ModalsLayerProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showAISettings: boolean;
  setShowAISettings: (show: boolean) => void;
  showCategoryModal: boolean;
  setShowCategoryModal: (show: boolean) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;
  showImportConfirmModal: boolean;
  setShowImportConfirmModal: (show: boolean) => void;
  showManualImportModal: boolean;
  setShowManualImportModal: (show: boolean) => void;

  categories: Category[];
  editingCategoryId: string | null;
  handleSaveCategory: (name: string, type: CategoryType) => Promise<void>;
  quickAddUrl?: string;
  setQuickAddUrl: (url: string | undefined) => void;
  editingLinkId: string | null;
  setIsQuickAddCategory: (is: boolean) => void;
  setEditingCategoryId: (id: string | null) => void;

  // Import related
  pendingImportLinks: LinkItem[];
  processAIImportHandler: () => Promise<void>;
  startManualImport: () => void;
  manualImportCandidates: any[];
  toggleCandidate: (index: number) => void;
  updateCandidateCategory: (index: number, category: CategoryType) => void;
  toggleAllCandidates: (selectAll: boolean) => void;
  finishBulkImport: () => Promise<void>;
  onSaveCategory: (category: Category) => Promise<void>;
}

export const ModalsLayer: React.FC<ModalsLayerProps> = ({
  showAuthModal, setShowAuthModal,
  showAISettings, setShowAISettings,
  showCategoryModal, setShowCategoryModal,
  showAddModal, setShowAddModal,
  showHelpModal, setShowHelpModal,
  showImportConfirmModal, setShowImportConfirmModal,
  showManualImportModal, setShowManualImportModal,
  categories,
  editingCategoryId,
  handleSaveCategory,
  quickAddUrl,
  setQuickAddUrl,
  editingLinkId,
  setIsQuickAddCategory,
  setEditingCategoryId,
  pendingImportLinks,
  processAIImportHandler,
  startManualImport,
  manualImportCandidates,
  toggleCandidate,
  updateCandidateCategory,
  toggleAllCandidates,
  finishBulkImport,
  onSaveCategory
}) => {
  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <AISettingsModal isOpen={showAISettings} onClose={() => setShowAISettings(false)} />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleSaveCategory}
        editingCategory={categories.find(c => c.id === editingCategoryId)}
      />

      <AddLinkModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setQuickAddUrl(undefined);
        }}
        categories={categories}
        initialUrl={quickAddUrl}
        onSaveCategory={onSaveCategory}
        onQuickAddCategory={() => {
          setEditingCategoryId(null);
          setIsQuickAddCategory(true);
          setShowCategoryModal(true);
        }}
        isEditing={!!editingLinkId}
      />

      <ImportConfirmModal
        isOpen={showImportConfirmModal}
        bookmarkCount={pendingImportLinks.length}
        onClose={() => setShowImportConfirmModal(false)}
        onAIImport={processAIImportHandler}
        onManualImport={startManualImport}
      />

      <ManualImportModal
        isOpen={showManualImportModal}
        candidates={manualImportCandidates}
        onClose={() => setShowManualImportModal(false)}
        onToggleCandidate={toggleCandidate}
        onUpdateCategory={updateCandidateCategory}
        onToggleAll={toggleAllCandidates}
        onImport={finishBulkImport}
      />
    </>
  );
};
