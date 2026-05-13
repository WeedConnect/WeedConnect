import { describe, it, expect, vi } from "vitest";
import {
  sortThreads,
  mapPostsToThreads,
  mapThreadsToCategories,
  filterThreads,
} from "./forum";

// Mockeo de los datos del foro (src/data/forum-mock.ts) solicitado por el usuario
vi.mock("@/data/forum-mock", () => {
  const MOCKED_DATA = [
    {
      id: "t1",
      slug: "test-thread-1",
      category: "Cultivo",
      category_id: "cat1",
      title: "Thread 1",
      pinned: false,
      votes: 10,
      category_position: 2,
      created_at: "2026-01-01T10:00:00Z",
      tags: ["indoor", "led"],
    },
    {
      id: "t2",
      slug: "test-thread-2",
      category: "Medicinal",
      category_id: "cat2",
      title: "Thread 2",
      pinned: true, // Debería ordenarse primero por ser pinned
      votes: 5,
      category_position: 1,
      created_at: "2026-01-02T10:00:00Z",
      tags: ["cbd"],
    },
    {
      id: "t3",
      slug: "test-thread-3",
      category: "Cultivo",
      category_id: "cat1",
      title: "Thread 3",
      pinned: false,
      votes: 25, // Mayor cantidad de votos que t1, misma posición de categoría
      category_position: 2,
      created_at: "2026-01-03T10:00:00Z",
      tags: ["outdoor"],
    },
  ];

  return {
    MOCK_THREADS: MOCKED_DATA,
    findThread: (slug: string) => MOCKED_DATA.find((t) => t.slug === slug),
  };
});

// Importamos los datos una vez mockeados para validar y usarlos en los tests
import { MOCK_THREADS } from "@/data/forum-mock";

describe("Lógica de negocio y utilidades del Foro (src/lib/forum.ts)", () => {
  
  describe("1) Ordenación de hilos (sortThreads)", () => {
    it("debe priorizar correctamente los hilos fijados (pinned) sobre los demás", () => {
      const sorted = sortThreads(MOCK_THREADS as any);
      
      // El primer elemento debe ser 't2' porque es el único con pinned: true
      expect(sorted[0].id).toBe("t2");
      expect(sorted[0].pinned).toBe(true);
    });

    it("debe ordenar por peso/posición de la categoría (menor número = mayor prioridad) si pinned es idéntico", () => {
      const customThreads = [
        { id: "a", pinned: false, category_position: 3, votes: 0, created_at: "2026-01-01T00:00:00Z" },
        { id: "b", pinned: false, category_position: 1, votes: 0, created_at: "2026-01-01T00:00:00Z" },
      ];
      const sorted = sortThreads(customThreads);
      
      // Posición 1 va antes que posición 3
      expect(sorted[0].id).toBe("b");
    });

    it("debe ordenar por recuento de votos (mayor a menor) si pinned y position coinciden", () => {
      const sorted = sortThreads(MOCK_THREADS as any);
      const unpinnedThreads = sorted.filter((t) => !t.pinned);
      
      // t3 tiene 25 votos y t1 tiene 10 votos. Ambos tienen position: 2 y pinned: false
      expect(unpinnedThreads[0].id).toBe("t3");
      expect(unpinnedThreads[0].votes).toBe(25);
      expect(unpinnedThreads[1].id).toBe("t1");
      expect(unpinnedThreads[1].votes).toBe(10);
    });

    it("debe ordenar por fecha de creación (más reciente primero) como último criterio de desempate", () => {
      const customThreads = [
        { id: "antiguo", pinned: false, category_position: 1, votes: 10, created_at: "2026-01-01T12:00:00Z" },
        { id: "reciente", pinned: false, category_position: 1, votes: 10, created_at: "2026-01-02T12:00:00Z" },
      ];
      const sorted = sortThreads(customThreads);
      
      // El hilo más reciente 'reciente' debe ir primero
      expect(sorted[0].id).toBe("reciente");
    });
  });

  describe("2) Mapeo de respuestas (posts) a sus categorías e hilos correspondientes", () => {
    const mockThreads = [
      { id: "t1", category_id: "cat_cultivo", title: "Hilo Cultivo 1" },
      { id: "t2", category_id: "cat_legal", title: "Hilo Legal 1" },
    ];

    const mockPosts = [
      { id: "p1", thread_id: "t1", body: "Post 1 del hilo 1" },
      { id: "p2", thread_id: "t1", body: "Post 2 del hilo 1" },
      { id: "p3", thread_id: "t2", body: "Post 1 del hilo 2" },
    ];

    const mockCategories = [
      { id: "cat_cultivo", name: "Cultivo" },
      { id: "cat_legal", name: "Legal" },
    ];

    it("debe mapear las respuestas correctamente a sus hilos correspondientes", () => {
      const mappedThreads = mapPostsToThreads(mockThreads, mockPosts);
      
      expect(mappedThreads).toHaveLength(2);
      
      const thread1 = mappedThreads.find((t) => t.id === "t1");
      expect(thread1?.posts).toHaveLength(2);
      expect(thread1?.posts.map(p => p.id)).toContain("p1");
      expect(thread1?.posts.map(p => p.id)).toContain("p2");

      const thread2 = mappedThreads.find((t) => t.id === "t2");
      expect(thread2?.posts).toHaveLength(1);
      expect(thread2?.posts[0].id).toBe("p3");
    });

    it("debe mapear los hilos de forma consistente a sus categorías correspondientes", () => {
      const mappedCategories = mapThreadsToCategories(mockCategories, mockThreads);
      
      expect(mappedCategories).toHaveLength(2);
      
      const categoryCultivo = mappedCategories.find((c) => c.id === "cat_cultivo");
      expect(categoryCultivo?.threads).toHaveLength(1);
      expect(categoryCultivo?.threads[0].id).toBe("t1");

      const categoryLegal = mappedCategories.find((c) => c.id === "cat_legal");
      expect(categoryLegal?.threads).toHaveLength(1);
      expect(categoryLegal?.threads[0].id).toBe("t2");
    });
  });

  describe("3) Filtrado de resultados por categorías o tags", () => {
    const testData = [
      { id: "h1", category_id: "cultivo", tags: ["led", "indoor"] },
      { id: "h2", category_id: "legal", tags: ["ley", "autocultivo"] },
      { id: "h3", category_id: "cultivo", tags: ["outdoor", "led"] },
    ];

    it("debe filtrar los hilos por categoría devolviendo resultados precisos", () => {
      const result = filterThreads(testData, { categoryId: "cultivo" });
      
      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toEqual(["h1", "h3"]);
    });

    it("debe filtrar los hilos por tags específicos devolviendo resultados precisos", () => {
      const result = filterThreads(testData, { tag: "led" });
      
      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toEqual(["h1", "h3"]);

      const singleTagResult = filterThreads(testData, { tag: "ley" });
      expect(singleTagResult).toHaveLength(1);
      expect(singleTagResult[0].id).toBe("h2");
    });

    it("debe filtrar combinando categoría y tag concurrentemente", () => {
      const result = filterThreads(testData, { categoryId: "cultivo", tag: "outdoor" });
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("h3");
    });

    it("debe devolver un array vacío si no se encuentran coincidencias", () => {
      const result = filterThreads(testData, { categoryId: "medicinal", tag: "cbd" });
      expect(result).toHaveLength(0);
    });
  });
});
