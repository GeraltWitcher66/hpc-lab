import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Printer } from 'lucide-react';
import type { Program, ProgramDay } from '../types/program';
import { getProgram } from '../lib/programStorage';

interface Props {
  programId: string;
  onBack: () => void;
}

export default function ProgramPrintPage({ programId, onBack }: Props) {
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    setProgram(getProgram(programId) || null);
  }, [programId]);

  const daysByWeek = useMemo(() => {
    if (!program) return [] as { week: number; days: ProgramDay[] }[];
    const map = new Map<number, ProgramDay[]>();
    for (const d of program.days) {
      const w = d.weekNumber || 1;
      if (!map.has(w)) map.set(w, []);
      map.get(w)!.push(d);
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([week, days]) => ({
        week,
        days: days.sort((a, b) => a.dayNumber - b.dayNumber),
      }));
  }, [program]);

  if (!program) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">برنامه یافت نشد.</p>
        <button onClick={onBack} className="btn-secondary mt-4">
          بازگشت
        </button>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('fa-IR');

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Toolbar */}
      <div className="print:hidden sticky top-0 z-10 p-4 bg-white border-b shadow-sm flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="btn-secondary !px-3">
          <ArrowRight size={18} />
          بازگشت
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-500 hidden sm:block">
            Print → Save as PDF برای ذخیره فایل
          </p>
          <button onClick={() => window.print()} className="btn-primary">
            <Printer size={18} />
            چاپ / ذخیره PDF
          </button>
        </div>
      </div>

      {/* Document */}
      <div
        id="print-area"
        className="max-w-3xl mx-auto my-6 print:my-0 bg-white shadow-lg print:shadow-none rounded-xl print:rounded-none overflow-hidden"
      >
        {/* Brand header */}
        <div className="bg-slate-900 text-white px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-lg">
                H
              </div>
              <div>
                <div className="text-xl font-bold tracking-wide">HPC Lab</div>
                <div className="text-xs text-slate-300">Human Performance Center</div>
              </div>
            </div>
            <div className="text-sm text-slate-300 space-y-0.5 sm:text-left">
              {program.clientName && (
                <div>
                  <span className="text-slate-400">شاگرد: </span>
                  <span className="text-white font-medium">{program.clientName}</span>
                  {program.clientCode && (
                    <span className="text-slate-400"> · {program.clientCode}</span>
                  )}
                </div>
              )}
              <div>
                <span className="text-slate-400">تاریخ صدور: </span>
                {today}
              </div>
            </div>
          </div>
        </div>

        {/* Program title */}
        <div className="px-6 py-5 sm:px-8 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">{program.name}</h1>
          {program.goal && (
            <p className="text-slate-600 mt-1">
              <span className="text-slate-400">هدف: </span>
              {program.goal}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
            <span className="bg-slate-100 px-2.5 py-1 rounded-full">{program.weeksCount} هفته</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-full">{program.days.length} روز تمرینی</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-full">
              {program.days.reduce((s, d) => s + d.exercises.length, 0)} حرکت
            </span>
          </div>
        </div>

        {/* Weeks & days */}
        <div className="px-4 py-5 sm:px-8 space-y-8">
          {daysByWeek.map(({ week, days }) => (
            <section key={week}>
              {program.weeksCount > 1 && (
                <h2 className="text-sm font-bold text-sky-700 mb-3 tracking-wide">
                  هفته {week}
                </h2>
              )}

              {days.map((day) => (
                <div key={day.id} className="mb-6 break-inside-avoid">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <h3 className="text-base font-bold text-slate-800 px-2 shrink-0">{day.name}</h3>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  {day.exercises.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-2">بدون حرکت</p>
                  ) : (
                    <>
                      {/* Desktop / print table */}
                      <div className="hidden sm:block print:block overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-right">
                              <th className="py-2 px-2 font-medium w-8">#</th>
                              <th className="py-2 px-2 font-medium text-right">حرکت</th>
                              <th className="py-2 px-2 font-medium text-center">ست</th>
                              <th className="py-2 px-2 font-medium text-center">تکرار</th>
                              <th className="py-2 px-2 font-medium text-center">شدت</th>
                              <th className="py-2 px-2 font-medium text-center">RPE/RIR</th>
                              <th className="py-2 px-2 font-medium text-center">استراحت</th>
                              <th className="py-2 px-2 font-medium">نکات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.exercises.map((ex, i) => (
                              <tr key={ex.id} className="border-b border-slate-100 align-top">
                                <td className="py-3 px-2 text-slate-400">{i + 1}</td>
                                <td className="py-3 px-2">
                                  <div className="flex gap-2">
                                    {ex.imageUrl && (
                                      <img
                                        src={ex.imageUrl}
                                        alt=""
                                        className="w-11 h-11 rounded object-cover shrink-0 bg-slate-100"
                                      />
                                    )}
                                    <div>
                                      <div className="font-semibold text-slate-900">{ex.nameFa}</div>
                                      {ex.nameEn && (
                                        <div className="text-xs text-slate-500">{ex.nameEn}</div>
                                      )}
                                      <div className="text-xs text-slate-400 mt-0.5 space-x-1 space-x-reverse">
                                        {ex.tempo && <span>تمپو: {ex.tempo}</span>}
                                        {ex.duration && <span>· {ex.duration}</span>}
                                        {ex.romLimitation && <span>· {ex.romLimitation}</span>}
                                      </div>
                                      {ex.videoUrl && (
                                        <a
                                          href={ex.videoUrl}
                                          className="text-xs text-sky-600 hover:underline break-all"
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          ویدیو آموزشی
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-center font-medium">{ex.sets}</td>
                                <td className="py-3 px-2 text-center">{ex.reps}</td>
                                <td className="py-3 px-2 text-center">{ex.intensity || '—'}</td>
                                <td className="py-3 px-2 text-center text-xs">
                                  {ex.rpe ? `RPE ${ex.rpe}` : ''}
                                  {ex.rpe && ex.rir ? ' / ' : ''}
                                  {ex.rir ? `RIR ${ex.rir}` : ''}
                                  {!ex.rpe && !ex.rir ? '—' : ''}
                                </td>
                                <td className="py-3 px-2 text-center">
                                  {ex.restSeconds ? `${ex.restSeconds} ثانیه` : '—'}
                                </td>
                                <td className="py-3 px-2 text-xs text-slate-600 max-w-[140px]">
                                  {ex.notes || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile cards */}
                      <div className="sm:hidden print:hidden space-y-3">
                        {day.exercises.map((ex, i) => (
                          <div key={ex.id} className="border border-slate-200 rounded-xl p-3">
                            <div className="flex gap-3">
                              {ex.imageUrl && (
                                <img
                                  src={ex.imageUrl}
                                  alt=""
                                  className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-xs text-slate-400 mb-0.5">حرکت {i + 1}</div>
                                <div className="font-semibold text-slate-900">{ex.nameFa}</div>
                                {ex.nameEn && (
                                  <div className="text-xs text-slate-500">{ex.nameEn}</div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                              <div className="bg-slate-50 rounded-lg py-2">
                                <div className="text-slate-400">ست</div>
                                <div className="font-bold text-slate-800">{ex.sets}</div>
                              </div>
                              <div className="bg-slate-50 rounded-lg py-2">
                                <div className="text-slate-400">تکرار</div>
                                <div className="font-bold text-slate-800">{ex.reps}</div>
                              </div>
                              <div className="bg-slate-50 rounded-lg py-2">
                                <div className="text-slate-400">استراحت</div>
                                <div className="font-bold text-slate-800">
                                  {ex.restSeconds ? `${ex.restSeconds}s` : '—'}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                              {ex.intensity && <div>شدت: {ex.intensity}</div>}
                              {(ex.rpe || ex.rir) && (
                                <div>
                                  {ex.rpe && `RPE ${ex.rpe}`}
                                  {ex.rpe && ex.rir ? ' · ' : ''}
                                  {ex.rir && `RIR ${ex.rir}`}
                                </div>
                              )}
                              {ex.tempo && <div>تمپو: {ex.tempo}</div>}
                              {ex.romLimitation && <div>محدودیت: {ex.romLimitation}</div>}
                              {ex.notes && <div>نکته: {ex.notes}</div>}
                              {ex.videoUrl && (
                                <a href={ex.videoUrl} className="text-sky-600 block truncate">
                                  ویدیو آموزشی
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </section>
          ))}
        </div>

        {program.notes && (
          <div className="mx-4 sm:mx-8 mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <h4 className="font-semibold text-slate-800 text-sm mb-1">یادداشت مربی</h4>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{program.notes}</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-100 text-center text-xs text-slate-400">
          HPC Lab — برنامه اختصاصی برای {program.clientName || 'شاگرد'} · محرمانه
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 12mm; }
          body { background: white !important; }
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            box-shadow: none;
            border-radius: 0;
          }
          .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
          a { color: inherit; text-decoration: none; }
        }
      `}</style>
    </div>
  );
}
