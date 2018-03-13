'use strict'

/* eslint-env node, es6 */

/**
 * Event to get available inventory within a timeframe.
 *
 * @event getAvailable
 * @param  {number} start
 * @param  {number} end
 * @fires  gotAvailable
 */

/**
 * Event to get an entry by date.
 *
 * @event getEntry
 * @type  {number}
 * @fires gotEntry
 */

/**
 * Event to get entries within a timeframe.
 *
 * @event getEntries
 * @param  {number} start
 * @param  {number} end
 * @fires  gotEntries
 */

/**
 * Event to update a single entry.
 *
 * @event updateEntry
 * @type  {Entry}
 * @fires updatedEntry
 */

/**
 * Event to update multiple entries.
 *
 * @event updateEntries
 * @type  {Entry[]}
 * @fires updatedEntries
 */

/**
 * Event fired when available inventory has been calculated.
 *
 * @event gotAvailable
 * @type  {number[]}
 */

/**
 * Event fired when a single entry has been retrieved.
 *
 * @event gotEntry
 * @type  {Entry}
 */

/**
 * Event fired when multiple entries have been retrieved.
 *
 * @event gotEntries
 * @type  {Entry[]}
 */

/**
 * Event fired when multiple entries have been updated.
 *
 * @event updatedEntries
 */

/**
 * Event fired when a single entry has been updated.
 *
 * @event updatedEntry
 */
