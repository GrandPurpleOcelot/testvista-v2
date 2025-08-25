import { useState, useCallback, useRef } from "react";
import { ArtifactVersion, VersionManager } from "@/types/version";

interface ArtifactData {
  requirements: any[];
  viewpoints: any[];
  testCases: any[];
}

export function useVersionManager(initialData: ArtifactData) {
  const [versionManager, setVersionManager] = useState<VersionManager>({
    versions: [],
    currentVersion: 0,
    hasUnsavedChanges: false
  });
  
  const lastSavedData = useRef<ArtifactData>(initialData);
  const versionCounter = useRef(1);

  const createVersion = useCallback((
    description: string,
    currentData: ArtifactData,
    isAutoSave = false,
    artifactType?: "requirement" | "viewpoint" | "testcase",
    artifactId?: string
  ): ArtifactVersion => {
    const changes = detectChanges(lastSavedData.current, currentData);
    
    const version: ArtifactVersion = {
      id: `v${versionCounter.current}-${Date.now()}`,
      versionNumber: versionCounter.current++,
      timestamp: new Date(),
      description,
      author: "Current User", // In real app, get from auth
      artifactType: artifactType || "requirement", // Default type
      artifactId: artifactId || "all",
      snapshot: JSON.parse(JSON.stringify(currentData)),
      changesSummary: changes,
      isAutoSave
    };

    return version;
  }, []);

  const detectChanges = (oldData: ArtifactData, newData: ArtifactData): string[] => {
    const changes: string[] = [];

    // Compare requirements
    const reqChanges = compareArrays(oldData.requirements, newData.requirements, "requirement");
    changes.push(...reqChanges);

    // Compare viewpoints  
    const vpChanges = compareArrays(oldData.viewpoints, newData.viewpoints, "viewpoint");
    changes.push(...vpChanges);

    // Compare test cases
    const tcChanges = compareArrays(oldData.testCases, newData.testCases, "testcase");
    changes.push(...tcChanges);

    return changes;
  };

  const compareArrays = (oldArray: any[], newArray: any[], type: string): string[] => {
    const changes: string[] = [];
    
    // Check for additions
    const addedItems = newArray.filter(newItem => 
      !oldArray.find(oldItem => oldItem.id === newItem.id)
    );
    addedItems.forEach(item => {
      changes.push(`Added ${type} ${item.id}`);
    });

    // Check for removals
    const removedItems = oldArray.filter(oldItem =>
      !newArray.find(newItem => newItem.id === oldItem.id)
    );
    removedItems.forEach(item => {
      changes.push(`Removed ${type} ${item.id}`);
    });

    // Check for modifications
    oldArray.forEach(oldItem => {
      const newItem = newArray.find(item => item.id === oldItem.id);
      if (newItem) {
        const itemChanges = compareObjects(oldItem, newItem);
        itemChanges.forEach(change => {
          changes.push(`${type} ${oldItem.id}: ${change}`);
        });
      }
    });

    return changes;
  };

  const compareObjects = (oldObj: any, newObj: any): string[] => {
    const changes: string[] = [];
    const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    keys.forEach(key => {
      if (key === 'lastModified' || key === 'changeHistory') return; // Skip meta fields
      
      const oldValue = oldObj[key];
      const newValue = newObj[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push(`${key} changed`);
      }
    });

    return changes;
  };

  const saveVersion = useCallback((
    description: string,
    currentData: ArtifactData,
    isCheckpoint = false
  ) => {
    const version = createVersion(description, currentData, false);
    
    setVersionManager(prev => ({
      ...prev,
      versions: [...prev.versions, version],
      currentVersion: version.versionNumber,
      hasUnsavedChanges: false
    }));

    lastSavedData.current = JSON.parse(JSON.stringify(currentData));
    
    return version;
  }, [createVersion]);

  const markUnsavedChanges = useCallback(() => {
    setVersionManager(prev => ({
      ...prev,
      hasUnsavedChanges: true
    }));
  }, []);

  const restoreVersion = useCallback((versionId: string): ArtifactData | null => {
    const version = versionManager.versions.find(v => v.id === versionId);
    if (!version) return null;

    setVersionManager(prev => ({
      ...prev,
      currentVersion: version.versionNumber,
      hasUnsavedChanges: false
    }));

    lastSavedData.current = JSON.parse(JSON.stringify(version.snapshot));
    return version.snapshot;
  }, [versionManager.versions]);

  const autoSave = useCallback((currentData: ArtifactData) => {
    // Auto-save every 5 minutes if there are unsaved changes
    if (versionManager.hasUnsavedChanges) {
      const version = createVersion("Auto-save", currentData, true);
      setVersionManager(prev => ({
        ...prev,
        versions: [...prev.versions, version],
        currentVersion: version.versionNumber,
        hasUnsavedChanges: false
      }));
      lastSavedData.current = JSON.parse(JSON.stringify(currentData));
    }
  }, [createVersion, versionManager.hasUnsavedChanges]);

  return {
    versionManager,
    saveVersion,
    restoreVersion,
    markUnsavedChanges,
    autoSave,
    detectChanges: (currentData: ArtifactData) => detectChanges(lastSavedData.current, currentData)
  };
}